#!/usr/bin/python2.4
#
# Copyright 2011 Google Inc. All Rights Reserved.

### personal commentds by Maple7sha

"""WebRTC Demo

This module demonstrates the WebRTC API by implementing a simple video chat app.
"""

import sys
sys.path.insert(0, 'libs')
sys.path.insert(0, 'libs/tweepy')
import cgi
import logging
import os
import random
import re
import json
import jinja2
import webapp2
import threading
import datetime
import copy
import requests
import tweepy
import dateutil.parser

from config import OAUTH_CONFIG
from google.appengine.api import channel
from google.appengine.ext import db
from google.appengine.ext import ndb
from gaesessions import get_current_session
from webrtc_config import get_webrtc_config

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

# Lock for syncing DB operation in concurrent requests handling.
# TODO(brave): keeping working on improving performance with thread syncing.
# One possible method for near future is to reduce the message caching.
LOCK = threading.RLock()

def generate_random(length):
  word = ''
  for _ in range(length):
    word += random.choice('0123456789')
  return word

# def sanitize(key):
#   return re.sub('[^a-zA-Z0-9\-]', '-', key)

### need to implement: if the host quit, we have to close the sesssion
def handle_message(user, message):
  # implement broadcast to OTHERUSERS! 
  logging.info('handle_message' + str(user) + message)
  message_obj = json.loads(message)
  connect_user_key = session.get('connect_user_key')
  # beforeunload
  if message_obj['type'] == 'bye':
    connect_user_key.delete()
    return
  # starthosting
  elif message_obj['type'] == 'broadcast' or message_obj['type'] == 'join':
    connect_user_key.get().activeMeeting = meeting.key()
    connect_user_key.get().put()
    logging.info('User ' + connect_user_key.id() + ' started broadcasting')
    # room.select_host(user)
    # on_message(room, room.get_next_user(), message)
  # to potentially start next connection only if broadcast started; else, handled by add_user adding to queue
  elif message_obj['type'] == 'ready':
    return
    # if room.host_started:
    #   room.connect_queue.append(user)
    #   room.put()
    #   if len(room.connect_queue) > 0:
    #     on_message(room, room.get_next_user(), json.dumps({'type': 'broadcast'}))
  # to trigger next connection (remove top from the queue and proceed)
  elif message_obj['type'] == 'connected':
    return
    # room.connect_queue.pop(0)
    # room.put()
    # if len(room.connect_queue) > 0:
    #   on_message(room, room.get_next_user(), json.dumps({'type': 'broadcast'}))
  # handle all other types of cross messages, like Candidate, Offer and Answer
  else:
    channel_messageByMeeting(meeting)


def get_saved_messages(client_id):
  return Message.gql("WHERE client_id = :id", id=client_id)

def delete_saved_messages(client_id):
  messages = get_saved_messages(client_id)
  for message in messages:
    message.delete()
    logging.info('Deleted the saved message for ' + client_id)

def send_saved_messages(client_id):
  messages = get_saved_messages(client_id)
  for message in messages:
    channel.send_message(client_id, message.msg)
    logging.info('Delivered saved message to ' + client_id)
    message.delete()

### if the receiver is online, send message; else, cache it 
def on_message(room, user_id, message):
  #client_id = make_client_id(room, user)
  client_id = user_id
  if room.is_connected(user):
    channel.send_message(client_id, message)
    logging.info('Delivered message to user ' + user_id)
  else:
    new_message = Message(client_id = client_id, msg = message)
    new_message.put()
    logging.info('Saved message for user ' + user_id)


@db.transactional
def connect_user(user_id):
  ### add user to ConnectedUserModel:
  connecteduser = ConnectedUserModel()
  key = connecteduser.put()
  session = get_current_session()
  session['connect_user_key'] = key

def fetch_user_for_session(session=None):
  if session is None:
    session = get_current_session()

  user = None
  if session.get('id'):
    user = ndb.Key(UserModel, session['id']).get()

  return user

def fetch_initial_store_data_and_render(self, extra_initial_store_data={}):
  session = get_current_session()
  initial_store_data = {}

  # token_timeout for channel creation, default 30min, max 1 days, min 3min.
  token_timeout = self.request.get_range(
    'tt',
    min_value = 3,
    max_value = 1440,
    default = 30
  )

  user = None
  user_id = None

  if session.get('id'):
    user = fetch_user_for_session(session)
    user_id = session['id']
  elif session.get('anonymous_user_id'):
    user_id = session['anonymous_user_id']
  else:
    user_id = session['anonymous_user_id'] = generate_random(8)
  
  connect_user(user_id)

  initial_store_data.update({
    'webRTC': get_webrtc_config(self, user_id),
    'currentUser': {
      'user': user,
      'channelToken': channel.create_channel(user_id, token_timeout)
    }
  })

  initial_store_data.update(extra_initial_store_data)

  template = jinja_environment.get_template('index.html')
  template_values = {
    'is_usingwebpack': self.request.get('usewebpack') == 'true',
    'initial_store_data': json.dumps(initial_store_data, cls=APIJSONEncoder)
  }
  
  self.response.out.write(template.render(template_values))


# This database is to store the messages from the sender client when the
# receiver client is not ready to receive the messages.
# Use TextProperty instead of StringProperty for msg because
# the session description can be more than 500 characters.
class Message(db.Model):
  client_id = db.StringProperty()
  msg = db.TextProperty()

### Room stores personal connection detail and user properties 
class Room(db.Model):
  """All the data we store for a room"""
  users = db.ListProperty(str)
  users_connected = db.ListProperty(bool)
  host = db.StringProperty() ### host/broadcaster index
  host_started = db.BooleanProperty(False)
  connect_queue = db.ListProperty(str)

  def __str__(self):
    result = '['
    for i in range(len(self.users)):
      result += "%s-%r," % (self.users[i], self.users_connected[i])
    if len(result) > 1:
      result = result[:-1] 
    result += ']'
    return result

  def get_occupancy(self):
    return len(self.users)

  def get_other_users(self, user):
    users = [];
    for other_user in self.users:
      if other_user != user: 
        users.append(other_user)
    logging.info("other users: " + ''.join(users))
    return users

  def get_next_user(self):
    if len(self.connect_queue) > 0:
     return self.connect_queue[0]

  def has_user(self, user):
    if user in self.users:
      return True
    else:
      return False

  def add_user(self, user):
    ### consider limiting the number of audiences here! 
    self.users.append(user)
    self.users_connected.append(True)
    ### if not started, add to the queue; else, add through ready
    if not self.host_started:
      self.connect_queue.append(user)
    self.put()

  ### chose the given host and start broadcasting
  def select_host(self, user):
    self.host = user
    self.host_started = True
    self.connect_queue.remove(user)
    self.put()
    logging.info('SELECTED host ' + str(self.host_started) + user)
    logging.info("Host chosen and start broadcasting")

  def remove_user(self, user):
    logging.info('delete user called' + str(self.get_occupancy()))
    if user in self.users:
      delete_saved_messages(user)
      self.users_connected.pop(self.users.index(user))
      self.users.remove(user)
      self.put()
    if self.get_occupancy() == 0 or self.host == user:
      logging.info('ROOM DELETED' + str(self.get_occupancy()))
      self.delete()

  def set_connected(self, user):
    self.users_connected[self.users.index(user)] = True
    self.put()

  def is_connected(self, user):
    if user in self.users:
      return self.users_connected[self.users.index(user)]
    else: 
      return False

### transactional means atomic operation here
@db.transactional
def connect_user_to_room(room_key, user):
  room = Room.get_by_key_name(room_key)
  # Check if room has user in case that disconnect message comes before
  # connect message with unknown reason, observed with local AppEngine SDK.
  if room and room.has_user(user):
    room.set_connected(user)
    logging.info('User ' + user + ' connected to room ' + room_key)
    logging.info('Room ' + room_key + ' has state ' + str(room))
  else:
    logging.warning('Unexpected Connect Message to room ' + room_key)
  return room

### figure out what the self.request.get('from') obtains
class ConnectPage(webapp2.RequestHandler):
  def post(self):
    key = self.request.get('from')
    room_key, user = key.split('/')
    with LOCK:
      room = connect_user_to_room(room_key, user)
      if room and room.has_user(user):
        send_saved_messages(user)

### why does it jump to disconnect the host? 
class DisconnectPage(webapp2.RequestHandler):
  def post(self):
    key = self.request.get('from')
    room_key, user = key.split('/')
    with LOCK:
      room = Room.get_by_key_name(room_key)
      if room and room.has_user(user):
        other_users = room.get_other_users(user)
        for other_user in other_users:
          ##### look into the add/removal scheme here! 
          #room.remove_user(user) #, we also remove user on_message, if do it here, remove 2
          logging.info('User ' + user + ' removed from room ' + room_key)
          logging.info('Room ' + room_key + ' has state ' + str(room))
    logging.warning('User ' + user + ' disconnected from room ' + room_key)

### Got message from clients here? 
class MessagePage(webapp2.RequestHandler):
  def post(self, meetingId):
    message = self.request.body
    meetingId = self.request.get('r')
    # need to revise if other method is used to retrieve meeting
    meeting = MeetingModel.get_by_id(meetingId)
    with LOCK:
      handle_message(message, meeting)

class MainPage(webapp2.RequestHandler):
  def get(self):
    fetch_initial_store_data_and_render(self)

### Handle the case where clients request to join existing room
class MeetingPage(webapp2.RequestHandler):
  def get(self, room_key):
    fetch_initial_store_data_and_render(self)

### upon xmlhttprequest for webrtc, return initial data set for channel
class RequestBroadcastData(webapp2.RequestHandler):
  def get(self, room_key):
    # token_timeout for channel creation, default 30min, max 1 days, min 3min.
    token_timeout = self.request.get_range('tt',
                                           min_value = 3,
                                           max_value = 1440,
                                           default = 30)
    user = None
    ### everyone will be assigned a user number
    ### for future, can connect with user account
    ### everyone's initiator value set to 1, NEGATIVE, who initiates will get 0
    initiator = 1
    with LOCK:
      room = Room.get_by_key_name(room_key)
      ### create new room
      if not room:
        user = generate_random(8)
        room = Room(key_name = room_key)
        room.add_user(user)
        ###########
        #room.select_host(user)
      ### add to existing room, 
      elif room:
        logging.info("Current Occupancy: " + str(room.get_occupancy()))
        user = generate_random(8)
        room.add_user(user)
        #initiator = 1



    token = create_channel(room, user, token_timeout)

    data = {
      'token': token,
      'me': user,
      'room_key': room_key,
      'initiator': initiator
    }
    logging.info('correctly established!')
    self.response.out.write(json.dumps(data))


### message all connected users 
def channel_messageConnected(message):
  for user in ConnectedUserModel.query():
    channel.send_message(user.key.id(), message)

def channel_messageByMeeting(message, meeting):
  for user in ConnectedUserModel.query(ConnectedUserModel.activeMeeting == meeting):
    if user.key != session['connect_user_key']:
      channel.send_message(user.key.id(), message)

### Collection of dataModels
# Log all transactions that calls any of APIHandler methods
# Only meetingjoin data has 'meetingId' and 'userId'; all other methods has 'id' refer to either meeting/user
# For methods that involves a write, written data is stored as data
# FOr methods that involves a fetch, response data is stored as data 
### Maintain users currently connected for broadcasting 

class LogModel(ndb.Model):
  datetime = ndb.DateTimeProperty(auto_now_add=True)
  #model = ndb.StringProperty(choices=['meeting','question','answer', 'topics', 'user', 'agenda'])
  method = ndb.StringProperty()
  data = ndb.JsonProperty()

class UserModel(ndb.Model):
  id = ndb.StringProperty()
  photoUrl = ndb.StringProperty()
  photoThumbnailUrl = ndb.StringProperty()
  name = ndb.StringProperty()
  screen_name = ndb.StringProperty()
  location = ndb.StringProperty()
  bio = ndb.StringProperty()
  attend = ndb.IntegerProperty(repeated=True)
  host = ndb.IntegerProperty(repeated=True)

class MeetingModel(ndb.Model):
  title = ndb.StringProperty()
  description = ndb.StringProperty()
  start = ndb.DateTimeProperty()
  host = ndb.KeyProperty(kind=UserModel)
  attendees = ndb.KeyProperty(kind=UserModel, repeated=True)
  isBroadcasting = ndb.BooleanProperty()

class AgendaModel(ndb.Model):
  # topics contains a list of {id: tId, content: '', questions: [qId, ]}
  topics = ndb.JsonProperty()

class TopicsModel(ndb.Model):
  content = ndb.StringProperty()
  questions = ndb.StringProperty(repeated=True)

class QuestionModel(ndb.Model):
  meetingId = ndb.StringProperty()
  content = ndb.StringProperty()
  answers = ndb.StringProperty(repeated=True)


class ConnectedUserModel(ndb.Model):
  activeMeeting = ndb.KeyProperty(kind = MeetingModel)

class APIJSONEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, datetime.datetime):
      return obj.isoformat()

    if isinstance(obj, MeetingModel):
      model_dict = obj.to_dict()
      model_dict['key'] = obj.key
      model_dict['host'] = obj.host.get()
      model_dict['attendees'] = [attendee.get() for attendee in obj.attendees]
      return model_dict

    if isinstance(obj, ndb.Model):
      model_dict = obj.to_dict()
      model_dict['key'] = obj.key
      return model_dict

    if isinstance(obj, ndb.Key):
      return obj.urlsafe()

    return json.JSONEncoder.default(self, obj)


class APIHandler(webapp2.RequestHandler):
  def post(self):
    name = self.request.get('request')
    logging.info('API Handler: ' + name)

    handlers = {
      'userfetch': self.user_fetch,
      'meetingfetch': self.meeting_fetch,
      'meetingcreate': self.meeting_create,
      'meetingupdate': self.meeting_update,
      'agendafetch': self.agenda_fetch,
      'explorefetch': self.explore_fetch,
      'meetingjoin': self.meeting_join
    }

    handler = handlers[name.lower()]
    response = handler(self.request, self.response)

    self.response.out.write(json.dumps(response, cls=APIJSONEncoder))

  @classmethod
  def add_log(self, method, data):
    # create new log entry 
    loggingId = LogModel.query().count()
    log = LogModel.get_by_id(str(loggingId))
    while log:
      loggingId += 1
      log = LogModel.get_by_id(loggingId)
    log = LogModel(id = str(loggingId))
    # function name 
    log.method = method
    log.data = data 
    log.put()
    for each in LogModel.query():
      logging.info('LOGGED into ndb: ' + method)

  @classmethod
  def user_fetch(self, request, response):
    user = UserModel.get_by_id(request.get('userId'))
    if user: 
      return user
    else: 
      return {'error': 'NotFound'}

  @classmethod
  def explore_fetch(self, request, response):
    meetings = []
    query = MeetingModel.query()
    for meeting in query.fetch(30):
      meetings.append(meeting)
    return meetings

  @classmethod
  def meeting_fetch(self, request, response):
    return ndb.Key(urlsafe=request.get('key')).get()

  # Modifies data, LOG and BROADCAST
  @classmethod
  def meeting_create(self, request, response):
    meeting = MeetingModel()
    meeting.title = request.get('title')
    meeting.description = request.get('description')
    meeting.start = dateutil.parser.parse(request.get('start'))
    meeting.topics = copy.deepcopy(request.get('topics'))
    meeting.host = fetch_user_for_session().key
    meeting.attendees = []
    key = meeting.put()

    meetingAgenda = AgendaModel(parent=key)
    meetingAgenda.topics = []
    meetingAgenda.put()

    self.add_log('meeting_create', meeting.to_dict())
    return meeting

  # Modifies data, LOG and BROADCAST
  @classmethod
  def meeting_update(self, request, response):
    meeting = ndb.Key(urlsafe=request.get('key')).get()
    meeting.title = request.get('title')
    meeting.description = request.get('description')
    meeting.start = dateutil.parser.parse(request.get('start'), ignoretz=True)
    meeting.put()
    self.add_log('meeting_update', meeting.to_dict())
    return meeting

  # Modifies data, LOG and BROADCAST
  @classmethod
  def meeting_join(self, request, response):
    session = get_current_session()
    if not session['id']:
      #response.out.write('User not logged in yet')
      logging.info('User to join meeting not logged in')
    else: 
      meeting = MeetingModel.get_by_id(request.get('meetingId'))
      meeting.attendees.append(session['id'])
      meeting.put()
      response.out.write(request.get('meetingId'))
      self.add_log('meeting_join', meeting.to_dict())

  @classmethod
  def agenda_fetch(self, request, response):
    meetingId = request.get('meetingId')
    topics = []
    agenda = AgendaModel.get_by_id(meetingId) # meetingId and agendaId equivalent
    if agenda: 
      for t in agenda.topics:
        qlist = []
        for i in t.questions:
          q = QuestionModel.get_by_id(i)
          # note the answers are a list of indices 
          qlist.append({'content': q.content, 'answers': q.answers})
        topic = {'id': t.id,
                 'content': t.content,
                 'questions': qlist
        }
        topics.append(topic)
    else: 
      agenda = []
    logging.info(topics)
    response.out.write(json.dumps(topics))
    # self.add_log('agendafetch', topics)

### after login case
class TwitterAuthorized(webapp2.RequestHandler):
  def get(self):
    ### also need to handle the case where request token is no longer valid
    session = get_current_session()
    auth = tweepy.OAuthHandler(
      OAUTH_CONFIG['tw']['consumer_key'], 
      OAUTH_CONFIG['tw']['consumer_secret']
    )
    auth.request_token = session['twitter_request_token']
    verifier = self.request.GET.get('oauth_verifier')

    ### request access token 
    try:
      auth.get_access_token(verifier)
      print 'Success! '
    except tweepy.TweepError:
      print 'Error! Failed to get access token.'
      self.redirect('/user/login?redirect=' + session['redirect'])
      return

    ### save tokens to session
    session['access_token'] = auth.access_token
    session['access_token_secret'] = auth.access_token_secret
    session['auth'] = auth
    self.redirect(session['redirect'])

    ### add user to data base if not exist already 
    api = tweepy.API(auth)
    me = api.me()
    me_id_str = me.id_str

    ### save user id to session for meetingjoin etc
    session['id'] = me_id_str
    user_key = ndb.Key(UserModel, me_id_str)
    user = user_key.get()

    if not user: 
      user = UserModel()
      user.key = user_key
      user.photoUrl = me.profile_image_url.replace('_normal','_bigger')
      user.photoThumbnailUrl = me.profile_image_url
      user.name = me.name
      user.screen_name = me.screen_name
      user.location = me.location
      user.bio = me.description
      user.put()

class LoginHandler(webapp2.RequestHandler):
  def get(self):
    ### check if already have session 
    session = get_current_session()
    session['redirect'] = self.request.get('redirect')

    ### prevent injected url redirect to other sites
    if ':' in session['redirect']:
      self.redirect('/WillBeHandledByRouteErrorHandler')

    if session.get('auth') == None:
      ### get request token and save in session
      auth = tweepy.OAuthHandler(
        OAUTH_CONFIG['tw']['consumer_key'], 
        OAUTH_CONFIG['tw']['consumer_secret'], 
        OAUTH_CONFIG['tw']['callback_url']
      )

      try: 
        redirect_url = str(auth.get_authorization_url())
        session['twitter_request_token'] = auth.request_token
        self.redirect(redirect_url)
      except tweepy.TweepError:
        logging.info('Error! Failed to get request token. ')
        self.redirect('/')
    else:
      self.redirect(session['redirect'])

class LogoutHandler(webapp2.RequestHandler):
  def get(self):
    session = get_current_session()
    session.clear()
    ### will redefine the redirect route, 
    self.redirect(OAUTH_CONFIG['internal']['logout_redirect_url'])

class RouteErrorHandler(webapp2.RequestHandler):
  def get(self):
    self.response.out.write('INVALID URL. Redirect URL may have been modified')
    self.response.set_status(404)

app = webapp2.WSGIApplication([
    (r'/', MainPage),
    (r'/meeting/([^/]+)', MeetingPage),
    (r'/explore/meeting/([^/]+)', MeetingPage),
    (r'/meeting/([^/]+)/requestBroadcastData', RequestBroadcastData),
    (r'/api', APIHandler),
    (r'/user/login', LoginHandler),
    (r'/user/logout', LogoutHandler),
    (r'/twitterauthorized', TwitterAuthorized),
    (r'/message/([^/]+)', MessagePage),
    ('/_ah/channel/connected/', ConnectPage),
    ('/_ah/channel/disconnected/', DisconnectPage),
    ### all other unmapped url shall be directed to error page 
    (r'.+', RouteErrorHandler)
  ], debug=True)
