#!/usr/bin/python2.4
#
# Copyright 2011 Google Inc. All Rights Reserved.


"""
Adapted from source: https://code.google.com/p/webrtc/source/browse/trunk/samples/js/apprtc/apprtc.py

Webapp2 server side script for Rehash.

This module mainly handles client-side requests for:
  * Get/post requests from clients
  * Channel API
  * Store/retrieve data from ndb data data models
  * Twitter login/logout redirects
  * Establish WebRTC connections
"""

import sys
sys.path.insert(0, 'libs')
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
from data_uri import DataURI

jinja_environment = jinja2.Environment(
  loader=jinja2.FileSystemLoader(os.path.dirname(__file__))
)

"""
Channel API related methods 
Establish persistent connection between client and Google servers
and allow messages from app to client to be sent without polling
"""
@db.transactional
def channel_create_user(token_timeout, user_key=None):
  connected_user = ConnectedUserModel()
  connected_user.isConnected = False
  connected_user.timeout = token_timeout
  connected_user.user = user_key
  key = connected_user.put()
  
  return {
    'connectedUserId': key.urlsafe(),
    'channelToken': channel.create_channel(key.urlsafe(), token_timeout)
  }

@db.transactional
def channel_connect_user(connected_user_key):
  connected_user = ndb.Key(urlsafe=connected_user_key).get()
  connected_user.isConnected = True
  connected_user.put()

  for message in ConnectedUserMessageModel.query(
    ConnectedUserMessageModel.to == connected_user.key
  ):
    channel.send_message(connected_user_key, message.content)
    logging.info('resending message ' + message.content)
    message.key.delete()


@db.transactional
def channel_disconnect_user(connected_user_key):
  ndb.Key(urlsafe=connected_user_key).delete()


def channel_message(sender_connected_user_key, connected_user, content):
  if connected_user is None or sender_connected_user_key == connected_user.key:
    return

  content_json = json.dumps(content, cls=APIJSONEncoder)

  if connected_user.isConnected == False:
    logging.info('saving message: ' + content_json)
    message = ConnectedUserMessageModel()
    message.to = connected_user.key
    message.content = content_json
    return message.put_async()

  channel.send_message(connected_user.key.urlsafe(), content_json)
  logging.info('sending message: ' + content_json)


def channel_messageAll(sender_connected_user_key, message):
  for connected_user in ConnectedUserModel.query():
    channel_message(sender_connected_user_key, connected_user, message)


def channel_messageByMeeting(sender_connected_user_key, meeting_key, message):
  connected_user_query = ConnectedUserModel.query(
    ConnectedUserModel.activeMeeting == meeting_key
  )

  for connected_user in connected_user_query:
    channel_message(sender_connected_user_key, connected_user, message)


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

"""
Gather data relevant to set up WebRTC/Channel API for first client request
"""
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
  user_key = user.key if user is not None else None

  current_user = {'user': user}
  current_user.update(channel_create_user(token_timeout, user_key))

  initial_store_data.update({
    'webRTC': get_webrtc_config(self),
    'currentUser': current_user
  })

  initial_store_data.update(extra_initial_store_data)

  template = jinja_environment.get_template('index.html')
  template_values = {
    'is_usingwebpack': self.request.get('usewebpack') == 'true',
    'initial_store_data': json.dumps(initial_store_data, cls=APIJSONEncoder)
  }
  
  self.response.out.write(template.render(template_values))


""" 
Collection of dataModels
""" 
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
  picture = ndb.BlobProperty(default=None)
  pictureMimeType = ndb.StringProperty()
  broadcastPicture = ndb.BlobProperty(default=None)
  broadcastPictureMimeType = ndb.StringProperty()
  status = ndb.StringProperty(
    choices=['scheduled', 'broadcasting', 'ended'], 
    default='scheduled'
  )

class TopicModel(ndb.Model):
  user = ndb.KeyProperty(kind=UserModel)
  content = ndb.StringProperty()

class QuestionModel(ndb.Model):
  user = ndb.KeyProperty(kind=UserModel)
  content = ndb.StringProperty()

class BroadcastModel(ndb.Model):
  hostConnectedUser = ndb.KeyProperty()
  topic = ndb.KeyProperty(kind=TopicModel)
  question = ndb.KeyProperty(kind=QuestionModel)

class BroadcastLogModel(ndb.Model):
  datetime = ndb.DateTimeProperty(auto_now_add=True)
  method = ndb.StringProperty()
  data = ndb.StringProperty()

class BroadcastRecordingModel(ndb.Model):
  recording = ndb.BlobProperty(indexed=False) 

class ConnectedUserModel(ndb.Model):
  user = ndb.KeyProperty(kind=UserModel)
  timeout = ndb.IntegerProperty()
  created = ndb.DateTimeProperty(auto_now_add=True)
  isConnected = ndb.BooleanProperty(default=False)
  activeMeeting = ndb.KeyProperty(kind=MeetingModel)

class ConnectedUserMessageModel(ndb.Model):
  to = ndb.KeyProperty(kind=ConnectedUserModel)
  content = ndb.TextProperty()

# INPUT: ndb Model object 
# OUTPUT: dictionary (JSON) of the object data, with references dereferrenced 
#         and replaced with corresponding objects
class APIJSONEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, datetime.datetime):
      return obj.isoformat()

    if isinstance(obj, MeetingModel):
      model_dict = obj.to_dict()
      model_dict['id'] = obj.key.id()
      model_dict['host'] = obj.host.get()
      model_dict['attendees'] = [user.get() for user in obj.attendees]
      model_dict['subscribers'] = [user.get() for user in obj.subscribers]

      if obj.picture is not None:
        model_dict['pictureUrl'] = \
          '/api/meeting/' + str(obj.key.id()) + '/picture'

      if obj.broadcastPicture is not None:
        model_dict['broadcastPictureUrl'] = \
          '/api/meeting/' + str(obj.key.id()) + '/broadcastPicture'

      del model_dict['picture']
      del model_dict['pictureMimeType']
      del model_dict['broadcastPicture']
      del model_dict['broadcastPictureMimeType']

      return model_dict

    if isinstance(obj, TopicModel):
      model_dict = obj.to_dict()
      model_dict['id'] = obj.key.id()
      model_dict['meetingId'] = obj.key.parent().id()
      model_dict['user'] = obj.user.get()
      return model_dict

    if isinstance(obj, QuestionModel):
      model_dict = obj.to_dict()
      model_dict['id'] = obj.key.id()
      model_dict['meetingId'] = obj.key.parent().parent().id()
      model_dict['topicId'] = obj.key.parent().id()
      model_dict['user'] = obj.user.get()
      return model_dict

    if isinstance(obj, ndb.Model):
      model_dict = obj.to_dict()
      model_dict['id'] = obj.key.id()
      model_dict['key'] = obj.key
      return model_dict

    if isinstance(obj, ndb.Key):
      return obj.urlsafe()

    return json.JSONEncoder.default(self, obj)

"""
API class with methods that handle corresponding client requests 
"""
class API:
  @staticmethod
  def connected_user_fetch(request):
    user_key = get_user_key_for_session()
    token_timeout = request.get_range(
      'tt',
      min_value = 3,
      max_value = 1440,
      default = 30
    )

    return channel_create_user(user_key, token_timeout)

  @staticmethod
  def user_fetch(request):
    return UserModel.get_by_id(request.get('userId'))

  @staticmethod
  def explore_fetch(request):
    meetings = []
    query = MeetingModel.query()
    for meeting in query.fetch(30):
      meetings.append(meeting)
    return meetings

  @staticmethod
  def meeting_fetch(request):
    return MeetingModel.get_by_id(int(request.get('id')))

  @staticmethod
  def meeting_create(request):
    meeting = MeetingModel()
    meeting.title = request.get('title')
    meeting.description = request.get('description')
    meeting.start = dateutil.parser.parse(request.get('start'), ignoretz=True)
    meeting.topics = copy.deepcopy(request.get('topics'))
    meeting.host = fetch_user_for_session().key
    key = meeting.put()

    broadcast = BroadcastModel(id=key.id(), parent=key)
    broadcast.put()

    connected_user_key = ndb.Key(urlsafe=request.get('connectedUserId'))

    channel_messageAll(connected_user_key, {
      'type': 'meetingCreate',
      'meeting': meeting
    })

    return meeting

  # Modifies data, LOG and BROADCAST
  @staticmethod
  def meeting_update(request):
    meeting = MeetingModel.get_by_id(int(request.get('id')))
    meeting.title = request.get('title')
    meeting.description = request.get('description')
    meeting.start = dateutil.parser.parse(request.get('start'), ignoretz=True)
    meeting.put()

    connected_user_key = ndb.Key(urlsafe=request.get('connectedUserId'))

    channel_messageAll(connected_user_key, {
      'type': 'meetingUpdate',
      'meeting': meeting
    })

    return meeting

  @staticmethod
  def meeting_subscribe(request):
    meeting = MeetingModel.get_by_id(int(request.get('id')))
    user = fetch_user_for_session()

    if meeting.stats == 'scheduled':
      meeting.subscribers.append(user.key)
      meeting.put()

    connected_user_key = ndb.Key(urlsafe=request.get('connectedUserId'))

    channel_messageByMeeting(connected_user_key, meeting.key, {
      'type': 'meetingSubscribe',
      'meetingId': meeting.key.id(),
      'user': user
    })

  @staticmethod
  def meeting_open(request):
    user = fetch_user_for_session()
    meeting = MeetingModel.get_by_id(int(request.get('id')))

    if meeting.status == 'broadcasting' and user is not None:
      meeting.attendees.append(user.key)
      meeting.put()

    connected_user = ndb.Key(urlsafe=request.get('connectedUserId')).get()
    connected_user.activeMeeting = meeting.key
    connected_user.put();

    if user is not None:
      channel_messageByMeeting(connected_user.key, meeting.key, {
        'type': 'meetingOpen',
        'meetingId': meeting.key.id(),
        'user': user
      })

  @staticmethod
  def meeting_close(request):
    connected_user = ndb.Key(urlsafe=request.get('connectedUserId')).get()
    connected_user.activeMeeting = None
    connected_user.put();

    user_key = get_user_key_for_session()
    meeting_key = ndb.Key(MeetingModel, int(request.get('id')))

    if user_key is not None:
      channel_messageByMeeting(connected_user.key, meeting_key, {
        'type': 'meetingClose',
        'meetingId': meeting_key.id(),
        'userId': user_key.id()
      })

  @staticmethod
  def agenda_fetch(request):
    meeting_key = ndb.Key(MeetingModel, int(request.get('meetingId')))

    return {
      'meetingId': meeting_key.id(),
      'topics': TopicModel.query(ancestor=meeting_key).fetch(),
      'questions': QuestionModel.query(ancestor=meeting_key).fetch()
    }

  @staticmethod
  def agenda_topic_add(request):
    meeting_key = ndb.Key(MeetingModel, int(request.get('meetingId')))

    topic = TopicModel(parent=meeting_key)
    topic.user = get_user_key_for_session()
    topic.content = request.get('content')
    topic.put()

    connected_user_key = ndb.Key(urlsafe=request.get('connectedUserId'))
    channel_messageByMeeting(connected_user_key, meeting_key, {
      'type': 'agendaTopicAdd',
      'meetingId': meeting_key.id(),
      'topic': topic
    })
    
    return topic

  @staticmethod
  def agenda_question_add(request):
    meeting_key = ndb.Key(MeetingModel, int(request.get('meetingId')))
    topic_key = ndb.Key(MeetingModel, int(request.get('topicId')), parent=meeting_key)

    question = QuestionModel(parent=topic_key)
    question.user = get_user_key_for_session()
    question.content = request.get('content')
    question.put()

    connected_user_key = ndb.Key(urlsafe=request.get('connectedUserId'))
    channel_messageByMeeting(connected_user_key, meeting_key, {
      'type': 'agendaQuestionAdd',
      'meetingId': meeting_key.id(),
      'question': question
    })

    return question

  @staticmethod
  def broadcast_fetch(request):
    meeting_id = int(request.get('meetingId'))
    meeting_key = ndb.Key(MeetingModel, meeting_id)

    return BroadcastModel.get_by_id(meeting_id, parent=meeting_key)

  @staticmethod
  def broadcast_start(request):
    meeting_id = int(request.get('meetingId'))
    meeting = MeetingModel.get_by_id(meeting_id)
    broadcast = BroadcastModel.get_by_id(meeting_id, parent=meeting.key)

    if meeting.status == 'ended':
      return

    if meeting.status != 'broadcasting':
      meeting.status = 'broadcasting'
      meeting.put()

    connected_user_key = ndb.Key(urlsafe=request.get('connectedUserId'))

    broadcast.hostConnectedUser = connected_user_key
    broadcast.put()

    channel_messageAll(connected_user_key, {
      'type': 'broadcastStart',
      'meetingId': meeting_id,
      'broadcast': broadcast
    })

    return broadcast

  @staticmethod
  def broadcast_end(request):
    meeting_id = int(request.get('meetingId'))
    meeting = MeetingModel.get_by_id(meeting_id)

    if meeting.status == 'ended':
      return

    meeting.status = 'ended'
    meeting.put()

    connected_user_key = ndb.Key(urlsafe=request.get('connectedUserId'))

    channel_messageAll(connected_user_key, {
      'type': 'broadcastEnd',
      'meetingId': meeting_id
    })

  @staticmethod
  def webrtc_send_message(request):
    to_connected_user_key = ndb.Key(urlsafe=request.get('to'))
    connected_user_key = ndb.Key(urlsafe=request.get('connectedUserId'))

    message = {
      'type': 'webRTCMessage',
      'sender': request.get('connectedUserId'),
      'message': request.get('message')
    }

    if to_connected_user_key is not None:
      channel_message(connected_user_key, to_connected_user_key.get(), message)


class APIHandler(webapp2.RequestHandler):
  def post(self):
    name = self.request.get('request')
    logging.info('API Handler: ' + name)

    handlers = {
      'connecteduserfetch': API.connected_user_fetch,
      'userfetch': API.user_fetch,
      'meetingfetch': API.meeting_fetch,
      'meetingcreate': API.meeting_create,
      'meetingupdate': API.meeting_update,
      'meetingsubscribe': API.meeting_subscribe,
      'meetingopen': API.meeting_open,
      'meetingclose': API.meeting_close,
      'agendafetch': API.agenda_fetch,
      'agendatopicadd': API.agenda_topic_add,
      'agendaquestionadd': API.agenda_question_add,
      'broadcastfetch': API.broadcast_fetch,
      'broadcaststart': API.broadcast_start,
      'broadcastend': API.broadcast_end,
      'webrtcsendmessage': API.webrtc_send_message,
      'explorefetch': API.explore_fetch
    }

    handler = handlers[name.lower()]
    response = handler(self.request)

    self.response.out.write(json.dumps(response, cls=APIJSONEncoder))


class UploadAPIHandler(webapp2.RequestHandler):
  def post(self):
    upload_type = self.request.get('type')
    meeting = MeetingModel.get_by_id(int(self.request.get('meetingId')))
    connected_user_key = ndb.Key(urlsafe=self.request.get('connectedUserId'))

    if upload_type == 'upload':
      recording_key = RecordingModel(parent = meeting.key)
      recording_key.get().recording = self.request.get('data')
      recording_key.get().put()
    elif upload_type == 'firstframe':
      uri = DataURI(self.request.get('img'))
      meeting.broadcastPicture = uri.data
      meeting.broadcastPictureMimeType = uri.mimetype
      meeting.put()
      
      channel_messageAll(connected_user_key, {
        'type': 'meetingUpdate',
        'meeting': meeting
      })


class BroadcastPictureAPIHandler(webapp2.RequestHandler):
  def get(self, meeting_id):
    meeting = MeetingModel.get_by_id(int(meeting_id))

    if meeting:
      self.response.headers['Content-Type'] = str(meeting.broadcastPictureMimeType)
      self.response.out.write(meeting.broadcastPicture)


class ExploreHandler(webapp2.RequestHandler):
  def get(self):
    fetch_initial_store_data_and_render(self)

class MeetingHandler(webapp2.RequestHandler):
  def get(self, meeting_id):
    fetch_initial_store_data_and_render(self)


"""
Handler called after users login with Twitter
"""
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
      logging.info('Get access token: Success! ')
    except tweepy.TweepError:
      logging.error('Error! Failed to get access token.')
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
    # check if already have session 
    session = get_current_session()
    session['redirect'] = self.request.get('redirect')

    # prevent injected url redirect to other sites
    if ':' in session['redirect']:
      self.redirect('/WillBeHandledByRouteErrorHandler')

    if get_user_key_for_session(session):
      logging.info('consumer_key ' + OAUTH_CONFIG['tw']['consumer_key'])
      logging.info('consumer_secret ' + OAUTH_CONFIG['tw']['consumer_secret'])
      logging.info('callback_url ' + OAUTH_CONFIG['tw']['callback_url'])

      # get request token and save in session
      auth = tweepy.OAuthHandler(
        OAUTH_CONFIG['tw']['consumer_key'], 
        OAUTH_CONFIG['tw']['consumer_secret'], 
        OAUTH_CONFIG['tw']['callback_url']
      )

      try: 
        redirect_url = str(auth.get_authorization_url())
        session['twitter_request_token'] = auth.request_token
        self.redirect(redirect_url)
      except tweepy.TweepError, e:
        logging.info('Error! Failed to get request token. ' + str(e))
    else:
      self.redirect(session['redirect'])


class LogoutHandler(webapp2.RequestHandler):
  def get(self):
    session = get_current_session()
    session.clear()
    ### will redefine the redirect route, 
    self.redirect(OAUTH_CONFIG['internal']['logout_redirect_url'])


class ConnectHandler(webapp2.RequestHandler):
  def post(self):
    connected_user_key = self.request.get('from')
    channel_connect_user(connected_user_key)


class DisconnectHandler(webapp2.RequestHandler):
  def post(self):
    connected_user_key = self.request.get('from')
    channel_disconnect_user(connected_user_key)


class RouteErrorHandler(webapp2.RequestHandler):
  def get(self):
    self.response.out.write('INVALID URL. Redirect URL may have been modified')
    self.response.set_status(404)


app = webapp2.WSGIApplication([
    ('/', ExploreHandler),
    (r'/meeting/([^/]+)', MeetingHandler),
    (r'/explore/meeting/([^/]+)', MeetingHandler),
    ('/api', APIHandler),
    ('/api/upload', UploadAPIHandler),
    (r'/api/meeting/([^/]+)/broadcastPicture', BroadcastPictureAPIHandler),
    ('/user/login', LoginHandler),
    ('/user/logout', LogoutHandler),
    ('/twitterauthorized', TwitterAuthorized),
    ('/_ah/channel/connected/', ConnectHandler),
    ('/_ah/channel/disconnected/', DisconnectHandler),
    ### all other unmapped url shall be directed to error page 
    (r'.+', RouteErrorHandler)
  ], debug=True)
