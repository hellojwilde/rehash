import logging

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

def get_webrtc_config(self):
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

  # if turn_server == 'false':
  turn_server = None
  turn_url = ''
  # else:
  #   turn_url = 'https://computeengineondemand.appspot.com/'
  #   turn_url = turn_url + 'turn?' + 'username=' + user + '&key=4080218913'

  pc_config = make_pc_config(stun_server, turn_server, ts_pwd)
  pc_constraints = make_pc_constraints(dtls, dscp, ipv6)
  offer_constraints = make_offer_constraints()
  media_constraints = make_media_stream_constraints('true', 'true')

  logging.info('correctly established!')

  return {
   'pcConfig': pc_config,
   'pcConstraints': pc_constraints,
   'offerConstraints': offer_constraints,
   'mediaConstraints': media_constraints,
   'turnUrl': turn_url,
   'stereo': stereo,
   'audioSendCodec': audio_send_codec,
   'audioReceiveCodec': audio_receive_codec
  }
