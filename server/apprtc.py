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

### need to implement: if the host quit, we have to close the sesssion
def handle_message(user, message):
  # implement broadcast to OTHERUSERS! 
  logging.info('handle_message' + str(user) + message)
  message_obj = json.loads(message)
  connected_user_key = session.get('connected_user_key')
  # beforeunload
  if message_obj['type'] == 'bye':
    connected_user_key.delete()
    return
  # starthosting
  elif message_obj['type'] == 'broadcast' or message_obj['type'] == 'join':
    connected_user_key.get().activeMeeting = meeting.key()
    connected_user_key.get().put()
    logging.info('User ' + connected_user_key.id() + ' started broadcasting')
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

@db.transactional
def connect_user(user=None):
  ### add user to ConnectedUserModel:
  connected_user = ConnectedUserModel()
  connected_user.user = user.key if user is not None else None
  key = connected_user.put()

  session = get_current_session()
  session['connected_user_key'] = key.urlsafe()

  return key.urlsafe()

def disconnect_user():
  ### remove user from ConnectedUserModel:
  session = get_current_session()
  ndb.Key(urlsafe=session['connected_user_key']).delete()

def channel_messageAll(message):
  ### message all connected users 
  session = get_current_session()

  for connected_user in ConnectedUserModel.query():
    connected_user_key = connected_user.key.urlsafe()
    if connected_user_key != session['connected_user_key']:
      channel.send_message(
        connected_user_key, 
        json.dumps(message, cls=APIJSONEncoder)
      )

def channel_messageByUserInMeeting(user_key, meeting_key, message):
  connected_user_query = ConnectedUserModel.query(
    ConnectedUserModel.user == user_key and
    ConnectedUserModel.activeMeeting == meeting_key
  )

  for connected_user in connected_user_query:
    channel.send_message(
      connected_user.key.urlsafe(), 
      json.dumps(message, cls=APIJSONEncoder)
    )

def channel_messageByMeeting(meeting_key, message):
  ### message all connected users with a specified active meeting
  session = get_current_session()
  connected_user_query = ConnectedUserModel.query(
    ConnectedUserModel.activeMeeting == meeting_key
  )

  for connected_user in connected_user_query:
    connected_user_key = connected_user.key.urlsafe()
    if connected_user_key != session['connected_user_key']:
      channel.send_message(
        connected_user_key,
        json.dumps(message, cls=APIJSONEncoder)
      )

def fetch_connected_user_for_session(session=None):
  if session is None:
    session = get_current_session()

  if session.get('connected_user_key'):
    connected_user = ndb.Key(urlsafe=session['connected_user_key']).get()

  return connected_user


def get_user_key_for_session(session=None):
  if session is None:
    session = get_current_session()

  key = None
  if session.get('id'):
    key = ndb.Key(UserModel, session['id'])

  return key


def fetch_user_for_session(session=None):
  user_key = get_user_key_for_session(session)
  return user_key.get() if user_key is not None else None


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

  user = fetch_user_for_session(session)
  connected_user_id = connect_user(user)

  initial_store_data.update({
    'webRTC': get_webrtc_config(self, connected_user_id),
    'currentUser': {
      'user': user,
      'channelToken': channel.create_channel(connected_user_id, token_timeout)
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

class ConnectPage(webapp2.RequestHandler):
  def post(self):
    pass

### why does it jump to disconnect the host? 
class DisconnectPage(webapp2.RequestHandler):
  def post(self):
    disconnect_user();

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
  data = ndb.StringProperty()

class UserModel(ndb.Model):
  id = ndb.StringProperty()
  photoUrl = ndb.StringProperty()
  photoThumbnailUrl = ndb.StringProperty()
  name = ndb.StringProperty()
  screenName = ndb.StringProperty()
  location = ndb.StringProperty()
  bio = ndb.StringProperty()

class MeetingModel(ndb.Model):
  title = ndb.StringProperty()
  description = ndb.StringProperty()
  start = ndb.DateTimeProperty()
  host = ndb.KeyProperty(kind=UserModel)
  subscribers = ndb.KeyProperty(kind=UserModel, repeated=True)
  attendees = ndb.KeyProperty(kind=UserModel, repeated=True)
  status = ndb.StringProperty(
    choices=['scheduled', 'broadcasting', 'ended'], 
    default='scheduled'
  )
  # recording = ndb.KeyProperty(kind=RecordingModel, repeated=True)

class RecordingModel(ndb.Model):
  recording = ndb.BlobProperty(indexed=False)
  # add additional information as needed here 

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
  user = ndb.KeyProperty(kind=UserModel)
  activeMeeting = ndb.KeyProperty(kind=MeetingModel)

class APIJSONEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, datetime.datetime):
      return obj.isoformat()

    if isinstance(obj, MeetingModel):
      model_dict = obj.to_dict()
      model_dict['id'] = obj.key.id()
      model_dict['key'] = obj.key
      model_dict['host'] = obj.host.get()
      model_dict['attendees'] = [user.get() for user in obj.attendees]
      model_dict['subscribers'] = [user.get() for user in obj.subscribers]
      return model_dict

    if isinstance(obj, ndb.Model):
      model_dict = obj.to_dict()
      model_dict['id'] = obj.key.id()
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
      'meetingsubscribe': self.meeting_subscribe,
      'meetingopen': self.meeting_open,
      'meetingclose': self.meeting_close,
      'broadcaststart': self.broadcast_start,
      'broadcastsendwebrtcmessage': self.broadcast_send_webrtc_message,
      'broadcastend': self.broadcast_end,
      'agendafetch': self.agenda_fetch,
      'explorefetch': self.explore_fetch
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
    log.data = json.dumps(data, cls=APIJSONEncoder) 
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
    return MeetingModel.get_by_id(int(request.get('id')))

  @classmethod
  def meeting_create(self, request, response):
    meeting = MeetingModel()
    meeting.title = request.get('title')
    meeting.description = request.get('description')
    meeting.start = dateutil.parser.parse(request.get('start'))
    meeting.topics = copy.deepcopy(request.get('topics'))
    meeting.host = fetch_user_for_session().key
    key = meeting.put()

    meetingAgenda = AgendaModel(parent=key)
    meetingAgenda.topics = []
    meetingAgenda.put()

    self.add_log('meeting_create', meeting)
    channel_messageAll({
      'type': 'meetingCreate',
      'meeting': meeting
    })

    return meeting

  # Modifies data, LOG and BROADCAST
  @classmethod
  def meeting_update(self, request, response):
    meeting = MeetingModel.get_by_id(int(request.get('id')))
    meeting.title = request.get('title')
    meeting.description = request.get('description')
    meeting.start = dateutil.parser.parse(request.get('start'), ignoretz=True)
    meeting.put()

    self.add_log('meeting_update', meeting)
    channel_messageAll({
      'type': 'meetingUpdate',
      'meeting': meeting
    })

    return meeting

  @classmethod
  def meeting_subscribe(self, request, response):
    meeting = MeetingModel.get_by_id(int(request.get('id')))
    user = fetch_user_for_session()

    if meeting.stats == 'scheduled':
      meeting.subscribers.append(user.key)
      meeting.put()

    channel_messageByMeeting(meeting.key, {
      'type': 'meetingSubscribe',
      'meetingId': meeting.key.id(),
      'user': user
    })

  @classmethod
  def meeting_open(self, request, response):
    meeting = MeetingModel.get_by_id(int(request.get('id')))

    if meeting.status == 'broadcasting':
      meeting.attendees.append(user)
      meeting.put()

    connected_user = fetch_connected_user_for_session()
    connected_user.activeMeeting = meeting.key
    connected_user.put();

    user = fetch_user_for_session()

    if user is not None:
      channel_messageByMeeting(meeting.key, {
        'type': 'meetingOpen',
        'meetingId': meeting.key.id(),
        'user': user
      })

  @classmethod
  def meeting_close(self, request, response):
    connected_user = fetch_connected_user_for_session()
    connected_user.activeMeeting = None
    connected_user.put();

    user_key = get_user_key_for_session()

    if user_key is not None:
      channel_messageByMeeting(meeting.key, {
        'type': 'meetingClose',
        'meetingId': meeting.key.id(),
        'userId': user_key.id()
      })

  @classmethod
  def broadcast_start(self, request, response):
    meeting = MeetingModel.get_by_id(int(request.get('meetingId')))

    if meeting.status != 'scheduled':
      return

    meeting.status = 'broadcasting'
    meeting.put()

    channel_messageAll({
      'type': 'broadcastStart',
      'meetingId': meeting.key.id()
    })

  @classmethod
  def broadcast_send_webrtc_message(self, request, response):
    meeting = MeetingModel.get_by_id(int(request.get('meetingId')))

  @classmethod
  def broadcast_end(self, request, response):
    meeting = MeetingModel.get_by_id(int(request.get('meetingId')))

    if meeting.status != 'broadcasting':
      return

    meeting.status = 'ended'
    meeting.put()

    channel_messageAll({
      'type': 'broadcastEnd',
      'meetingId': meeting.key.id()
    })

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
      user.screenName = me.screen_name
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

class UploadRecording(webapp2.RequestHandler):
  def post(self):
    ### shall save to meeting blob
    session = get_current_session()
    connected_user_key = session.get('connected_user_key')
    meeting_key = connected_user_key.get().activeMeeting
    recording = RecordingModel(parent = meeting_key)
    recording.put()
    # meeting.recording.append(recording)
    # meeting.put()
    # parent, Model


class RouteErrorHandler(webapp2.RequestHandler):
  def get(self):
    self.response.out.write('INVALID URL. Redirect URL may have been modified')
    self.response.set_status(404)

app = webapp2.WSGIApplication([
    (r'/', MainPage),
    (r'/meeting/([^/]+)', MeetingPage),
    (r'/explore/meeting/([^/]+)', MeetingPage),
    (r'/api', APIHandler),
    (r'/user/login', LoginHandler),
    (r'/user/logout', LogoutHandler),
    (r'/twitterauthorized', TwitterAuthorized),
    (r'/uploadrecording', UploadRecording),
    ('/_ah/channel/connected/', ConnectPage),
    ('/_ah/channel/disconnected/', DisconnectPage),
    ### all other unmapped url shall be directed to error page 
    (r'.+', RouteErrorHandler)
  ], debug=True)
