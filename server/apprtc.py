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

from config import OAUTH_CONFIG
from google.appengine.api import channel
from google.appengine.ext import db
from google.appengine.ext import ndb
from gaesessions import get_current_session

### Environment stores configuration and global objects, 
### used to load templates from the filesystem
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

### convert anything not alphanumberic to '-'
def sanitize(key):
  return re.sub('[^a-zA-Z0-9\-]', '-', key)

### client id based upon room_key to create GAE channels
### key().id_or_name() returns the string/number of name/id
def make_client_id(room, user):
  return room.key().id_or_name() + '/' + user

def get_default_stun_server(user_agent):
  default_stun_server = 'stun.l.google.com:19302'
  if 'Firefox' in user_agent:
    default_stun_server = 'stun.services.mozilla.com'
  return default_stun_server

def get_preferred_audio_receive_codec():
  return 'opus/48000'

def get_preferred_audio_send_codec(user_agent):
  # Empty string means no preference.
  preferred_audio_send_codec = ''
  # Prefer to send ISAC on Chrome for Android.
  if 'Android' in user_agent and 'Chrome' in user_agent:
    preferred_audio_send_codec = 'ISAC/16000'
  return preferred_audio_send_codec

def make_pc_config(stun_server, turn_server, ts_pwd):
  servers = []
  if turn_server:
    turn_config = 'turn:{}'.format(turn_server)
    servers.append({'urls':turn_config, 'credential':ts_pwd})
  if stun_server:
    stun_config = 'stun:{}'.format(stun_server)
  servers.append({'urls':stun_config})
  return {'iceServers':servers}

def create_channel(room, user, duration_minutes):
  client_id = make_client_id(room, user)
  return channel.create_channel(client_id, duration_minutes)

def make_loopback_answer(message):
  message = message.replace("\"offer\"", "\"answer\"")
  message = message.replace("a=ice- options:google-ice\\r\\n", "")
  return message

### need to implement: if the host quit, we have to close the sesssion
def handle_message(room, user, message):
  # implement broadcast to OTHERUSERS! 
  logging.info('handle_message' + str(user) + message)
  message_obj = json.loads(message)
  #other_users = room.get_other_users()
  room_key = room.key().id_or_name()

  ### IF SESSION ALREADY STARTED, send to host the user info 
  if message_obj['type'] == 'bye':
    room.remove_user(user)
    logging.info('User ' + user + ' quit from room ' + room_key)
    logging.info('Room ' + room_key + ' has state ' + str(room))
    return
  # to start a broadcast session by asking others to initialize  
  elif message_obj['type'] == 'broadcast':
    logging.info('User ' + user + ' started broadcasting')
    room.select_host(user)
    on_message(room, room.get_next_user(), message)
  # to potentially start next connection only if broadcast started; else, handled by add_user adding to queue
  elif message_obj['type'] == 'ready':
    if room.host_started:
      room.connect_queue.append(user)
      room.put()
      if len(room.connect_queue) > 0:
        on_message(room, room.get_next_user(), json.dumps({'type': 'broadcast'}))
    return
  # to trigger next connection (remove top from the queue and proceed)
  elif message_obj['type'] == 'connected':
    room.connect_queue.pop(0)
    room.put()
    if len(room.connect_queue) > 0:
      on_message(room, room.get_next_user(), json.dumps({'type': 'broadcast'}))
  # handle all other types of cross messages, like Candidate, Offer and Answer
  else:
    # also, queue, add alock later on
    if room.host == None:
      return
      # on_message(room, room.host, message)
    elif user == room.host: 
      on_message(room, room.get_next_user(), message)
    else:
      on_message(room, room.host, message)

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
def on_message(room, user, message):
  client_id = make_client_id(room, user)
  if room.is_connected(user):
    channel.send_message(client_id, message)
    logging.info('Delivered message to user ' + user)
  else:
    new_message = Message(client_id = client_id, msg = message)
    new_message.put()
    logging.info('Saved message for user ' + user)

def make_media_track_constraints(constraints_string):
  if not constraints_string or constraints_string.lower() == 'true':
    track_constraints = True
  elif constraints_string.lower() == 'false':
    track_constraints = False
  else:
    track_constraints = {'mandatory': {}, 'optional': []}
    for constraint_string in constraints_string.split(','):
      constraint = constraint_string.split('=')
      if len(constraint) != 2:
        logging.error('Ignoring malformed constraint: ' + constraint_string)
        continue
      if constraint[0].startswith('goog'):
        track_constraints['optional'].append({constraint[0]: constraint[1]})
      else:
        track_constraints['mandatory'][constraint[0]] = constraint[1]

  return track_constraints

def make_media_stream_constraints(audio, video):
  stream_constraints = (
      {'audio': make_media_track_constraints(audio),
       'video': make_media_track_constraints(video)})
  logging.info('Applying media constraints: ' + str(stream_constraints))
  return stream_constraints

def maybe_add_constraint(constraints, param, constraint):
  if (param.lower() == 'true'):
    constraints['optional'].append({constraint: True})
  elif (param.lower() == 'false'):
    constraints['optional'].append({constraint: False})

  return constraints

def make_pc_constraints(dtls, dscp, ipv6):
  constraints = { 'optional': [] }
  maybe_add_constraint(constraints, dtls, 'DtlsSrtpKeyAgreement')
  maybe_add_constraint(constraints, dscp, 'googDscp')
  maybe_add_constraint(constraints, ipv6, 'googIPv6')

  return constraints

def make_offer_constraints():
  constraints = { 'mandatory': {}, 'optional': [] }
  return constraints

def append_url_arguments(request, link):
  for argument in request.arguments():
    if argument != 'r':
      link += ('&' + cgi.escape(argument, True) + '=' +
                cgi.escape(request.get(argument), True))
  return link

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
    # avoid connecting to itself
    self.connect_queue.remove(user)
    self.put()
    logging.info('SELECTED host ' + str(self.host_started) + user)
    logging.info("Host chosen and start broadcasting")

  def remove_user(self, user):
    # if self.users.index(user) == 0:
    #   self.delete()
    logging.info('delete user called' + str(self.get_occupancy()))
    if user in self.users:
      delete_saved_messages(make_client_id(self, user))
      self.users_connected.pop(self.users.index(user))
      self.users.remove(user)
      self.put()
    # cur_num_users = len(self.users)
    # for j in range(cur_num_users ):
    #   i = cur_num_users - j - 1
    #   if self.users_connected[i] == False:
    #     delete_saved_messages(make_client_id(self, self.users[i]))
    #     self.users_connected.pop(i)
    #     self.users.remove(self.users[i])
    #     self.put()
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
        send_saved_messages(make_client_id(room, user))

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
          #if other_user and other_user != user:
            #channel.send_message(make_client_id(room, other_user),
            #                     '{"type":"bye"}')
            #logging.info('Sent BYE to ' + other_user)
    logging.warning('User ' + user + ' disconnected from room ' + room_key)

### Got message from clients here? 
class MessagePage(webapp2.RequestHandler):
  def post(self):
    message = self.request.body
    room_key = self.request.get('r')
    user = self.request.get('u')
    with LOCK:
      room = Room.get_by_key_name(room_key)
      if room:
        handle_message(room, user, message)
      else:
        logging.warning('Unknown room ' + room_key)

### are they inherent staff of webrtc?
class MainPage(webapp2.RequestHandler):
  def get(self):
    page = 'index.html'
    template_values = {}
    template = jinja_environment.get_template(page)
    self.response.out.write(template.render(template_values))

### Handle the case where clients request to join existing room
class MeetingPage(webapp2.RequestHandler):
  def get(self, room_key):
    # session = get_current_session()
    # if session.get('userId') == None:
    #   logging.info('client has not login yet')
    #   # logging.info(session['sid'])
    #   session['userId'] = 'User Id here'
    # else: 
    #   logging.info(session['userId'])
    page = 'index.html'
    template_values = {}
    template = jinja_environment.get_template(page)
    self.response.out.write(template.render(template_values))
    # page = 'index.html'
    # template_values = {}
    # loader = jinja2.FileSystemLoader('../client')
    # environment = jinja2.Environment(loader=loader)
    # template = environment.get_template(page)
    # self.response.out.write(template.render(template_values))

### upon xmlhttprequest for webrtc, return initial data set for channel
class RequestBroadcastData(webapp2.RequestHandler):
  def get(self, room_key):
    ### audio and video bools, currently set to true
    # audio = self.request.get('audio')
    # video = self.request.get('video')
    error_messages = []
    audio = 'true'
    video = 'true'

    ### stun server
    user_agent = self.request.headers['User-Agent']
    stun_server = self.request.get('ss')
    if not stun_server:
      stun_server = get_default_stun_server(user_agent)
    
    turn_server = self.request.get('ts')
    #turn_server = 'true'
    ts_pwd = self.request.get('tp')
    ### set audio send and receive codec
    audio_send_codec = self.request.get('asc')
    if not audio_send_codec:
      audio_send_codec = get_preferred_audio_send_codec(user_agent)
    audio_receive_codec = self.request.get('arc')
    if not audio_receive_codec:
      audio_receive_codec = get_preferred_audio_receive_codec()
    stereo = 'false'
    if self.request.get('stereo'):
      stereo = self.request.get('stereo')

    # Options for making pcConstraints
    dtls = self.request.get('dtls')
    dscp = self.request.get('dscp')
    ipv6 = self.request.get('ipv6')

    debug = self.request.get('debug')
    if debug == 'loopback':
      # Set dtls to false as DTLS does not work for loopback.
      dtls = 'false'

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


    if turn_server == 'false':
      turn_server = None
      turn_url = ''
    else:
      turn_url = 'https://computeengineondemand.appspot.com/'
      turn_url = turn_url + 'turn?' + 'username=' + user + '&key=4080218913'

    token = create_channel(room, user, token_timeout)
    pc_config = make_pc_config(stun_server, turn_server, ts_pwd)
    pc_constraints = make_pc_constraints(dtls, dscp, ipv6)
    offer_constraints = make_offer_constraints()
    media_constraints = make_media_stream_constraints(audio, video)

    data = {'token': token,
             'me': user,
             'room_key': room_key,
             'initiator': initiator,
             'pc_config': pc_config,
             'pc_constraints': pc_constraints,
             'offer_constraints': offer_constraints,
             'media_constraints': media_constraints,
             'turn_url': turn_url,
             'stereo': stereo,
             'audio_send_codec': audio_send_codec,
             'audio_receive_codec': audio_receive_codec
            }
    logging.info('correctly established!')
    self.response.out.write(json.dumps(data))


### Collection of dataModels
class LogModel(ndb.Model):
  datetime = ndb.DateTimeProperty(auto_now_add=True)
  #model = ndb.StringProperty(choices=['meeting','question','answer', 'topics', 'user', 'agenda'])
  method = ndb.StringProperty()
  data = ndb.JsonProperty()

class UserModel(ndb.Model):
  #id = ndb.IntegerProperty()
  photoUrl = ndb.StringProperty()
  photoThumbnailUrl = ndb.StringProperty()
  name = ndb.StringProperty()
  affiliation = ndb.StringProperty()
  bio = ndb.StringProperty()
  request_token = ndb.StringProperty()
  access_token = ndb.StringProperty()
  access_token_secret = ndb.StringProperty()

class MeetingModel(ndb.Model):
  #id = ndb.IntegerProperty()
  title = ndb.StringProperty()
  description = ndb.StringProperty()
  start = ndb.StringProperty()
  host = ndb.StringProperty()
  highlights = ndb.JsonProperty()
  attendees = ndb.StringProperty(repeated=True)
  isBroadcasting = ndb.BooleanProperty()

class AgendaModel(ndb.Model):
  meetingId = ndb.StringProperty()
  # topics contains a list of {id: tId, content: '', questions: [qId, ]}
  topics = ndb.JsonProperty()

class TopicsModel(ndb.Model):
  content = ndb.StringProperty()
  questions = ndb.StringProperty(repeated=True)

class QuestionModel(ndb.Model):
  content = ndb.StringProperty()
  answers = ndb.StringProperty(repeated=True)

class AnswerModel(ndb.Model):
  content = ndb.StringProperty()

class AdaptJsonEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, datetime.datetime):
      return obj.strftime('%Y-%m-%d %H:%M:%S')
    return json.JSONEncoder.default(self, obj)

class APIHandler(webapp2.RequestHandler):
  def post(self):
    logging.info('API Handler: ' + self.request.get('request'))

    if self.request.get('request').lower() == 'userfetch':
      self.userfetch(self.request, self.response)
    elif self.request.get('request').lower() == 'currentuserlogin':
      self.currentuserlogin(self.request, self.response, self)
    elif self.request.get('request').lower() == 'meetingfetch':
      self.meetingfetch(self.request, self.response)
    elif self.request.get('request').lower() == 'meetingcreate':
      self.meetingcreate(self.request, self.response)
    elif self.request.get('request').lower() == 'agendacreate':
      # agenda can be integrated with meetings?
      self.agendacreate(self.request, self.response)
    elif self.request.get('request').lower() == 'agendafetch':
      self.agendafetch(self.request, self.response)

  @classmethod
  def twitter_login(self):
    logging.info('request token inside callback function!!!!!!!!!!!!!!!!!!')

  @classmethod
  def add_user(self, id, request):
    user = UserModel(id = id)
    #user.id = id
    user.photoUrl = 'http://placehold.it/400x300'
    user.photoThumbnailUrl = 'http://placehold.it/50x50'
    user.name = 'Coleen Jose'
    user.affiliation = ''
    user.bio = 'Coleen Jose is an American-Filipino multimedia journalist and \
                documentary photographer. She writes and shoots for publications in the \
                US and Philippines. She was a reporting fellow for E&E Publishing\'s \
                ClimateWire in Washington, DC.'
    user.put()

  @classmethod
  def add_log(self, method, data):
    loggingId = LogModel.query().count()
    logging.info(loggingId)
    log = LogModel.get_by_id(str(loggingId))
    while log:
      loggingId += 1
      log = LogModel.get_by_id(loggingId)
    log = LogModel(id = str(loggingId))
    log.method = method
    log.data = data 
    log.put()
    for each in LogModel.query():
      logging.info('LOGGED into ndb: ' + method)

  @classmethod
  def userfetch(self, request, response):
    user = UserModel.get_by_id(request.get('userId'))
    if user: 
      data = {'id': request.get('userId'),
              'photoUrl': user.photoUrl, 
              'photoThumbnailUrl': user.photoThumbnailUrl,
              'name': user.name,
              'affiliation': user.affiliation,
              'bio': user.bio
      }
      response.out.write(json.dumps(data))
      self.add_log('userfetch', data)
    else: 
      data = {'error': 'not found'}
      response.out.write(json.dumps(data))
      user = UserModel(id = request.get('userId'))
      #user.id = request.get('userId')
      user.photoUrl = 'http://placehold.it/400x300'
      user.photoThumbnailUrl = 'http://placehold.it/50x50'
      user.name = 'Jonathan Wilde'
      user.affiliation = 'Tufts University'
      user.bio = ''
      user.put()

  @classmethod
  def currentuserlogin(self, request, response, instance):
    auth = tweepy.OAuthHandler(OAUTH_CONFIG['tw']['consumer_key'], OAUTH_CONFIG['tw']['consumer_secret'], OAUTH_CONFIG['tw']['callback_url'] + request.get('userId'))
    try: 
      redirect_url = str(auth.get_authorization_url())
    except tweepy.TweepError:
      logging.info('Error! Failed to get request token.')
    logging.info(redirect_url)
    # instance.redirect(redirect_url)

    user = UserModel.get_by_id(request.get('userId')) 
    if user: 
      data = {'id': request.get('userId'),
              'photoUrl': user.photoUrl, 
              'photoThumbnailUrl': user.photoThumbnailUrl,
              'name': user.name,
              'affiliation': user.affiliation,
              'bio': user.bio, 
              'redirect': redirect_url
      }
      user.request_token = json.dumps(auth.request_token)
      user.put()
      response.out.write(json.dumps(data))
      self.add_log('currentuserlogin', data)
    ### For testing only 
    else: 
      data = {'error': 'not found'}
      response.out.write(json.dumps(data))
      user = UserModel(id = request.get('userId'))
      #user.id = self.request.get('userId')
      user.photoUrl = 'http://placehold.it/400x300'
      user.photoThumbnailUrl = 'http://placehold.it/50x50'
      user.name = 'Jonathan Wilde'
      user.affiliation = 'Tufts University'
      user.bio = ''
      user.put()


  @classmethod
  def meetingfetch(self, request, response):
    logging.info('MEETING FETCH ')
    meeting = MeetingModel.get_by_id(request.get('meetingId'))
    if meeting: 
      attendees = []
      # construct attendees list to be sent back
      for attendeeId in meeting.attendees:
        logging.info(attendeeId)
        instance = UserModel.get_by_id(attendeeId)
        attendee = {'id': attendeeId, 
                'photoUrl': instance.photoUrl,
                'photoThumbnailUrl': instance.photoThumbnailUrl,
                'name': instance.name, 
                'bio': instance.bio
        }
        attendees.append(attendee)
        
      # construct host object to be sent back
      instance = UserModel.get_by_id(meeting.host)
      host = {'id': meeting.host, 
              'photoUrl': instance.photoUrl,
              'photoThumbnailUrl': instance.photoThumbnailUrl,
              'name': instance.name, 
              'bio': instance.bio
      }

      data = {'id': request.get('meetingId'),
              'title': meeting.title, 
              'description': meeting.description,
              'start': meeting.start,
              'host': host,
              'highlights': meeting.highlights,
              'attendees': attendees
      }
      response.out.write(json.dumps(data))
      # self.add_log('meetingfetch', data)

    else:
      logging.info('MEETING pushed ')
      meeting = MeetingModel(id = request.get('meetingId'))
      meeting.title ='The Philippines\'s Outsourcing Wave'
      meeting.description = 'Coleen Jose will discuss the process of reporting on the rapid \
                             increase in outsourcing operations in the Philippines and the impacts \
                             on Philippine youth.'
      meeting.start = '2015-03-03 12:12:12 Z'
      APIHandler.add_user('4', request)
      APIHandler.add_user('5', request)
      APIHandler.add_user('6', request)
      APIHandler.add_user('7', request)
      APIHandler.add_user('8', request)
      meeting.host = '4'
      meeting.highlights = [ \
                              { \
                                'type': 'TOPIC', \
                                'content': 'Challenges with competition for an outsourcing job' \
                              }, \
                              { \
                                'type': 'QUESTION', \
                                'content': 'What sorts of ethical challenges were there in reporting?' \
                              }, \
                              { \
                                'type': 'QUESTION', \
                                'content': 'What changes need to happen to the outsourcing industry?' \
                              } \
                            ]
      meeting.attendes = ['5', '6', '7', '8']
      meeting.put()
      logging.info('INSERT MEETING')

  @classmethod
  def meetingcreate(self, request, response):
    # create a new meeting, ensuring that meetingId has not been used
    meetingId = MeetingModel.query().count()
    logging.info(meetingId)
    meeting = MeetingModel.get_by_id(meetingId)
    while meeting:
      meetingId += 1
      meeting = MeetingModel.get_by_id(meetingId)
    # all ids about such entities are set strings for consistency 
    meeting = MeetingModel(id = str(meetingId))
    meeting.title = request.get('title')
    meeting.description = request.get('description')
    meeting.start = request.get('start')
    meeting.highlights = copy.deepcopy(request.get('highlights'))
    meeting.topics = copy.deepcopy(request.get('topics'))
    meeting.put()
    data = {'id': meetingId}
    response.out.write(json.dumps(data))

    ### need to amplify the data collected! 
    self.add_log('meetingcreate', data)

  @classmethod
  def agendacreate(self, request, response):
    # create a new meeting, ensuring that meetingId has not been used
    meetingId = request.get('meetingId')
    # current assumption: 1-1 relation!
    agendaId = meetingId
    # agendaId = len(AgendaModel)
    # agenda = AgendaModel.get_by_id(agendaId)
    # while agenda:
    #   agendaId += 1
    #   agenda = AgendaModel.get_by_id(agendaId)
    agenda = AgendaModel(id = agendaId)
    agenda.meetingId = meetingId
    agenda.topics = copy.deepcopy(request.get('topics'))
    agenda.put()
    data = {'id': meetingId,
            'topics': agenda.topics
    }
    self.add_log('agendacreate', data)

  @classmethod
  def agendafetch(self, request, response):
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
    self.add_log('agendafetch', topics)

### handle post-login case
### save username, etc on ndb
class TwitterAuthorized(webapp2.RequestHandler):
  def get(self):
    ### also need to handle the case where request token is no longer valid
    session = get_current_session()
    auth = tweepy.OAuthHandler(OAUTH_CONFIG['tw']['consumer_key'], OAUTH_CONFIG['tw']['consumer_secret'])
    auth.request_token = session['twitter_request_token']
    verifier = self.request.GET.get('oauth_verifier')

    print(OAUTH_CONFIG['tw']['consumer_key'])
    print(OAUTH_CONFIG['tw']['consumer_secret'])
    print(auth.request_token)
    print(verifier)

    try:
      auth.get_access_token(verifier)
      print 'Success! '
    except tweepy.TweepError:
      print 'Error! Failed to get access token.'
      self.redirect('/user/login')

    ### save tokens to session
    session['access_token'] = auth.access_token
    session['access_token_secret'] = auth.access_token_secret
    session['auth'] = auth

    api = tweepy.API(auth)
    personal_info = api.me()
    print(personal_info.id)
    
    self.redirect(session['redirect'])

    # page = 'index.html'
    # template_values = {}
    # template = jinja_environment.get_template(page)
    # self.response.out.write('authorized!')

class LoginHandler(webapp2.RequestHandler):
  def get(self):
    ### check if already have session 
    session = get_current_session()
    session['redirect'] = self.request.get('redirect')
    auth = tweepy.OAuthHandler(OAUTH_CONFIG['tw']['consumer_key'], OAUTH_CONFIG['tw']['consumer_secret'], OAUTH_CONFIG['tw']['callback_url'])
    if session.get('auth') == None:
      ### get request token and save in session
      try: 
        redirect_url = str(auth.get_authorization_url())
      except tweepy.TweepError:
        logging.info('Error! Failed to get request token.')
      session['twitter_request_token'] = auth.request_token
      self.redirect(redirect_url)
    else: 
      self.redirect(session['redirect'])

class LogoutHandler(webapp2.RequestHandler):
  def get(self):
    session = get_current_session()
    session.clear()
    ### will redefine the redirect route, 
    self.redirect('/meeting/0')


app = webapp2.WSGIApplication([
    (r'/', MainPage),
    (r'/meeting/(\d+)', MeetingPage),
    (r'/explore/meeting/(\d+)', MeetingPage),
    (r'/meeting/(\d+)/requestBroadcastData', RequestBroadcastData),
    (r'/api', APIHandler),
    (r'/user/login', LoginHandler),
    (r'/user/logout', LogoutHandler),
    (r'/twitterauthorized', TwitterAuthorized),
    ('/message', MessagePage),
    ('/_ah/channel/connected/', ConnectPage),
    ('/_ah/channel/disconnected/', DisconnectPage)
  ], debug=True)
