#!/usr/bin/python2.4
#
# Copyright 2011 Google Inc. All Rights Reserved.

### personal commentds by Maple7sha

"""WebRTC Demo

This module demonstrates the WebRTC API by implementing a simple video chat app.
"""

import cgi
import logging
import os
import random
import re
import json
import jinja2
import webapp2
import threading
from google.appengine.api import channel
from google.appengine.ext import db

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
  other_users = room.get_other_users(user)
  room_key = room.key().id_or_name()

  ### the bye functionality has been depreciated and replaced
  if message_obj['type'] == 'bye':
    room.remove_user(user)
    logging.info('User ' + user + ' quit from room ' + room_key)
    logging.info('Room ' + room_key + ' has state ' + str(room))
    return
  elif message_obj['type'] == 'broadcast':
    logging.info('User ' + user + ' started broadcasting')
    room.select_host(user)

  for other in other_users:
    on_message(room, other, message)

  # if message_obj['type'] == 'offer':
  #   logging.info('OFFER')hand
  #   on_message(room, room.host, message)
  # elif other_users:  
  #   for other_user in other_users:
  #     ### Special case the loopback scenario.
  #     ### disable loopback; add it back if required 
  #     if message_obj['type'] == 'offer':
  #       if other_user == user:
  #         message = make_loopback_answer(message)
  #     on_message(room, other_user, message)
  # else:
  #   # For unittest
  #   on_message(room, user, message)

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
  host_started = db.BooleanProperty()
  host_started = False

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

  def has_user(self, user):
    if user in self.users:
      return True
    else:
      return False

  def add_user(self, user):
    ### consider limiting the number of audiences here! 
    self.users.append(user)
    self.users_connected.append(True)
    self.put()

  ### chose the given host and start broadcasting
  def select_host(self, user):
    self.host = user
    self.host_started = True
    self.put()
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
    cur_num_users = len(self.users)
    for j in range(cur_num_users ):
      i = cur_num_users - j - 1
      if self.users_connected[i] == False:
        delete_saved_messages(make_client_id(self, self.users[i]))
        self.users_connected.pop(i)
        self.users.remove(self.users[i])
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
          if other_user and other_user != user:
            channel.send_message(make_client_id(room, other_user),
                                 '{"type":"bye"}')
            logging.info('Sent BYE to ' + other_user)
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
  """The main UI page, renders the 'index.html' template."""
  def get(self):
    return
### Handle the case where clients request to join existing room
class MeetingJoin(webapp2.RequestHandler):
  def get(self, room_key):
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

class MeetingBroadcast(webapp2.RequestHandler):
  def get(self, room_key):
    page = 'index.html'
    template_values = {}
    template = jinja_environment.get_template(page)
    self.response.out.write(template.render(template_values))

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
    initiator = 0
    with LOCK:
      room = Room.get_by_key_name(room_key)
      ### create new room
      if not room:
        user = generate_random(8)
        room = Room(key_name = room_key)
        room.add_user(user)
        ###########
        room.select_host(user)
      ### add to existing room, 
      elif room:
        logging.info("Current Occupancy: " + str(room.get_occupancy()))
        user = generate_random(8)
        room.add_user(user)
        initiator = 1


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
    logging.info('correctly established!');
    self.response.out.write(json.dumps(data));


app = webapp2.WSGIApplication([
    (r'/', MainPage),
    (r'/meeting/(\d+)', MeetingJoin),
    (r'/meeting/(\d+)/broadcast', MeetingBroadcast),
    (r'/meeting/(\d+)/requestBroadcastData', RequestBroadcastData),
    ('/message', MessagePage),
    ('/_ah/channel/connected/', ConnectPage),
    ('/_ah/channel/disconnected/', DisconnectPage)
  ], debug=True)
