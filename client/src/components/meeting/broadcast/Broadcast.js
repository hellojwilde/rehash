var React = require('react');
var WebRTCAdapter = require('helpers/WebRTCAdapter');
var WebRTCConstraints = require('helpers/WebRTCConstraints');

var {getUserMedia, attachMediaStream, reattachMediaStream} = WebRTCAdapter;
var {
  mergeConstraints, 
  getWithStereoIfPossible, 
  getPreferredAudioCodec, 
  getIceCandidateType
} = WebRTCConstraints;

require('3rdparty/bootstrap/css/bootstrap.css');
require('./Broadcast.css');

// variables to hold server data
var initiator;
var channelToken;
var me;
var roomKey;
var pcConfig;
var pcConstraints;
var offerConstraints;
var mediaConstraints;
var turnUrl;
var stereo;
var audio_send_codec;
var audio_receive_codec;

// additional variables for webrtc connection
var channel;
var hasLocalStream
var localStream;
var remoteStream;
var pc;
var socket;
var xmlhttp;
var started = false;
var turnDone = false;
var channelReady = false;
var signalingReady = false;
var msgQueue = [];

var sdpConstraints = {'mandatory': {
                      'OfferToReceiveAudio': true,
                      'OfferToReceiveVideo': true }};

var Broadcast = React.createClass({
  propTypes: {
    meetingId: React.PropTypes.number.isRequired
  },

  componentDidMount: function() {
    // if disconnect, request to delete on server
    window.addEventListener("beforeunload", function (e) {
      //this.sendMessage({type: 'bye'});
      console.log("quit")
      var msgString = JSON.stringify({type: 'bye'});
      var xhr_bye = new XMLHttpRequest();
      url = '/message?r=' + roomKey + '&u=' + me;
      xhr_bye.open('POST', url, true);
      xhr_bye.send(msgString);
    });

    var xhr = new XMLHttpRequest();
    url = `/meeting/${this.props.meetingId}/requestBroadcastData`;
    xhr.open('GET', url, true);
    xhr.onload = () => {
      var data = JSON.parse(xhr.responseText);

      // convert to number
      initiator=Number(data['initiator']);
      channelToken=data['token'];
      me=data['me'];
      roomKey=data['room_key'];
      pcConfig=data['pc_config'];
      pcConstraints=data['pc_constraints'];
      offerConstraints=data['offer_constraints'];
      mediaConstraints=data['media_constraints'];
      turnUrl=data['turn_url'];
      stereo=data['stereo'];
      audio_send_codec=data['audio_send_codec'];
      audio_receive_codec=data['audio_receive_codec'];

      console.log("NOTE HERE : " + JSON.stringify(data['pc_config'].iceServers[0].urls));
      // start the session to begin accepting server info
      this.openChannel();
    }.bind(this);
    xhr.send(); 
  },

  initialize: function() {
    this.maybeRequestTurn();
    signalingReady = initiator;

    if ((mediaConstraints.audio === false &&
        mediaConstraints.video === false) || initiator) {
      hasLocalStream = false;
      this.maybeStart();
    } else {
      hasLocalStream = true;
      this.doGetUserMedia();
    }
  },
  openChannel: function() {
    console.log('Opening channel.');
    var channel = new goog.appengine.Channel(channelToken);
    var handler = {
      'onopen': this.onChannelOpened,
      'onmessage': this.onChannelMessage,
      'onerror': this.onChannelError,
      'onclose': this.onChannelClosed
    };
    socket = channel.open(handler);
  },
  maybeRequestTurn: function() {
    // Allow to skip turn by passing ts=false to apprtc.
    if (turnUrl == '') {
      turnDone = true;
      return;
    }

    for (var i = 0, len = pcConfig.iceServers.length; i < len; i++) {
      if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
        turnDone = true;
        return;
      }
    }
    console.log("SHOWWWING: " + len);
    
    var currentDomain = document.domain;
    if (currentDomain.search('localhost') === -1 &&
        currentDomain.search('apprtc') === -1) {
      // Not authorized domain. Try with default STUN instead.
      turnDone = true;
      return;
    }
      // check out this part 
    turnDone = true;
    return;

    // No TURN server. Get one from computeengineondemand.appspot.com.
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = this.onTurnResult;
    xmlhttp.open('GET', turnUrl, true);
    xmlhttp.send();
  },
  onTurnResult: function() {
    if (xmlhttp.readyState !== 4)
      return;

    if (xmlhttp.status === 200) {
      var turnServer = JSON.parse(xmlhttp.responseText);
      // Create turnUris using the polyfill (adapter.js).
      var iceServers = createIceServers(turnServer.uris,
                                        turnServer.username,
                                        turnServer.password);
      if (iceServers !== null) {
        pcConfig.iceServers = pcConfig.iceServers.concat(iceServers);
      }
    } else {
      this.messageError('No TURN server; unlikely that media will traverse networks.  '
                   + 'If this persists please report it to '
                   + 'discuss-webrtc@googlegroups.com.'
                   + xmlhttp.status);
    }
    // If TURN request failed, continue the call with default STUN.
    turnDone = true;
    this.maybeStart();
  },
  doGetUserMedia: function() {                   
    try {
      getUserMedia({audio: true, video: true}, this.onUserMediaSuccess, this.onUserMediaError);

      console.log('Requested access to local media with mediaConstraints:\n' +
                  '  \'' + JSON.stringify(mediaConstraints) + '\'');
    } catch (e) {
      alert('getUserMedia() failed. Is this a WebRTC capable browser?');
      this.messageError('getUserMedia failed with exception: ' + e.message);
    }
  },
  createPeerConnection: function() {
    try {
      // Create an RTCPeerConnection via the polyfill (adapter.js).
      pc = new RTCPeerConnection(pcConfig, pcConstraints);
      pc.onicecandidate = this.onIceCandidate;
      console.log('Created RTCPeerConnnection with:\n' +
                  '  config: \'' + JSON.stringify(pcConfig) + '\';\n' +
                  '  constraints: \'' + JSON.stringify(pcConstraints) + '\'.');
    } catch (e) {
      this.messageError('Failed to create PeerConnection, exception: ' + e.message);
      alert('Cannot create RTCPeerConnection object; \
            WebRTC is not supported by this browser.');
      return;
    }
    pc.onaddstream = this.onRemoteStreamAdded;
    pc.onremovestream = this.onRemoteStreamRemoved;
  },
  // function that try to start connections when ready 
  maybeStart: function() {
    // !started &&
    // we want it to be able to restart and reinitiate and continue creating connections 
    if (signalingReady && channelReady && turnDone &&
        (localStream || !hasLocalStream)) {
      console.log('Creating PeerConnection.');
      this.createPeerConnection();

      if (hasLocalStream) {
        console.log('Adding local stream.');
        pc.addStream(localStream);
      } else {
        console.log('Not sending any stream.');
      }
      started = true;

      if (initiator)
        this.doCall();
      else
        this.calleeStart();
    }
  },
  doCall: function() {
    var constraints = this.mergeConstraints(offerConstraints, sdpConstraints);
    console.log('Sending offer to peer, with constraints: \n' +
                '  \'' + JSON.stringify(constraints) + '\'.')
    pc.createOffer(this.setLocalAndSendMessage,
                   this.onCreateSessionDescriptionError, constraints);
  },
  calleeStart: function() {
    // Callee starts to process cached offer and other messages.
    while (msgQueue.length > 0) {
      this.processSignalingMessage(msgQueue.shift());
    }
  },
  doAnswer: function() {
    console.log('Sending answer to peer.');
    pc.createAnswer(this.setLocalAndSendMessage,
                    this.onCreateSessionDescriptionError, sdpConstraints);
  },

  setLocalAndSendMessage: function(sessionDescription) {
////// double check if: if may produce a bug
    sessionDescription.sdp = this.maybePreferAudioReceiveCodec(sessionDescription.sdp);
    pc.setLocalDescription(sessionDescription,
         this.onSetSessionDescriptionSuccess, this.onSetSessionDescriptionError);
    this.sendMessage(sessionDescription);
  },
  setRemote: function(message) {
    // Set Opus in Stereo, if stereo enabled.
    if (stereo)
      message.sdp = getWithStereoIfPossible(message.sdp);
    message.sdp = this.maybePreferAudioSendCodec(message.sdp);
    pc.setRemoteDescription(new RTCSessionDescription(message),
         this.onSetRemoteDescriptionSuccess, this.onSetSessionDescriptionError);

    function onSetRemoteDescriptionSuccess() {
      console.log("Set remote session description success.");
      // By now all addstream events for the setRemoteDescription have fired.
      // So we can know if the peer is sending any stream or is only receiving.
      if (remoteStream) {
        this.waitForRemoteVideo();
        //waitForRemoteAudio();
      } else {
        console.log("Not receiving any stream.");
        this.transitionToActive();
      }
    }
  },
  sendMessage: function(message) {
    var msgString = JSON.stringify(message);
    console.log('C->S: ' + msgString);
    // NOTE: AppRTCClient.java searches & parses this line; update there when
    // changing here.
    var path = '/message?r=' + roomKey + '&u=' + me;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    xhr.send(msgString);
  },
  processSignalingMessage: function(message) {
    if (!started) {
      this.messageError('peerConnection has not been created yet!');
      return;
    }

    if (message.type === 'offer') {
      this.setRemote(message);
      this.doAnswer();
    } else if (message.type === 'answer') {
      this.setRemote(message);
    } else if (message.type === 'candidate') {
      var candidate = new RTCIceCandidate({sdpMLineIndex: message.label,
                                           candidate: message.candidate});
      pc.addIceCandidate(candidate,
                         this.onAddIceCandidateSuccess, this.onAddIceCandidateError);
    } else if (message.type === 'bye') {
      this.onRemoteHangup();
    } 
  },
  onAddIceCandidateSuccess: function () {
    console.log('AddIceCandidate success.');
  },
  onAddIceCandidateError: function (error) {
    this.messageError('Failed to add Ice Candidate: ' + error.toString());
  },
  onChannelOpened: function () {
    console.log('Channel opened.');
    channelReady = true;
    this.maybeStart();
    this.sendMessage({type: 'ready'});
  },
  onChannelMessage: function(message) {
    console.log('S->C: ' + message.data);
    var msg = JSON.parse(message.data);
    // Since the turn response is async and also GAE might disorder the
    // Message delivery due to possible datastore query at server side,
    // So callee needs to cache messages before peerConnection is created.

    // && !started commented out to allow multiple p2p connections
///////    
    if (!initiator) {
      if (msg.type === 'offer') {
        // Add offer to the beginning of msgQueue, since we can't handle
        // Early candidates before offer at present.
        msgQueue.unshift(msg);
        // Callee creates PeerConnection
        signalingReady = true;
        this.maybeStart();
      } else {
        msgQueue.push(msg);
      }
    } 
    // need to be selective! connect only if it matches your user name
    else{
      this.processSignalingMessage(msg);
    }
    // the audience should start the conversation
    if (initiator && msg.type === 'broadcast' ) {
      console.log('Received broadcast from Server! ');
      this.initialize();
    }

  },
  onChannelError: function () {
    this.messageError('Channel error.');
  },
  onChannelClosed: function () {
    console.log('Channel closed.');
  },
  messageError: function (msg) {
    console.log(msg);
  },
  onUserMediaSuccess: function (stream) {
    console.log('User has granted access to local media.');
    var video = this.refs['video'].getDOMNode();
    video.muted=true;
    attachMediaStream(video, stream);
    video.muted=true;
    video.play();
    localStream = stream;
    this.maybeStart();
  },
  onUserMediaError: function(error) {
    this.messageError('Failed to get access to local media. Error code was ' +
                 error.code + '. Continuing without sending a stream.');
    alert('Failed to get access to local media. Error code was ' +
          error.code + '. Continuing without sending a stream.');

    hasLocalStream = false;
    this.maybeStart();
  },
  onCreateSessionDescriptionError: function(error) {
    this.messageError('Failed to create session description: ' + error.toString());
  },
  onSetSessionDescriptionSuccess: function() {
    console.log('Set session description success.');
  },
  onSetSessionDescriptionError: function(error) {
    this.messageError('Failed to set session description: ' + error.toString());
  },
  onIceCandidate: function(event) {
    if (event.candidate) {
      this.sendMessage({type: 'candidate',
                   label: event.candidate.sdpMLineIndex,
                   id: event.candidate.sdpMid,
                   candidate: event.candidate.candidate});
    } else {
      console.log('End of candidates.');
    }
  },
  onRemoteStreamAdded: function(event) {
    var video = this.refs['video'].getDOMNode();
    console.log('Remote stream added.');
    attachMediaStream(video, event.stream);
    remoteStream = event.stream;
    video.play();
    this.sendMessage({type:'connected'});
  },
  onRemoteStreamRemoved: function(event) {
    console.log('Remote stream removed.');
  },

  onHangup: function() {
    console.log('Hanging up.');
    this.transitionToDone();
    localStream.stop();
    stop();
    // will trigger BYE from server
    socket.close();
  },
  onRemoteHangup: function() {
    // console.log('Session terminated.');
    // initiator = 1;
    // the host don't need to transitToWaiting at all just connect accept new connections
    // this.transitionToWaiting();
    // this.stop();
  },
  stop: function () {
    var video = this.refs['video'].getDOMNode();
    started = false;
    signalingReady = false;
    pc.close();
    pc = null;
    video.pause();
    remoteStream = null;
    msgQueue.length = 0;
  },
  waitForRemoteVideo: function() {
    // Call the getVideoTracks method via adapter.js.
    // ?? where is the variable declared? 
    videoTracks = remoteStream.getVideoTracks();
    if (videoTracks.length === 0 || remoteVideo.currentTime > 0) {
      this.transitionToActive();
    } else {
      setTimeout(waitForRemoteVideo, 100);
    }
  },
  transitionToActive: function() {
    //reattachMediaStream(miniVideo, localVideo);
    //remoteVideo.style.opacity = 1;
    // if initiator, retain the local video
    if (initiator) {
      attachMediaStream(video, remoteStream);
    }
  },
  transitionToWaiting: function() {
    // setTimeout(function() {
    //              localVideo.src = miniVideo.src;
    //              miniVideo.src = '';
    //              remoteVideo.src = '' }, 500);
    // miniVideo.style.opacity = 0;
    // remoteVideo.style.opacity = 0;
  },
  transitionToDone: function () {
    var video = this.refs['video'].getDOMNode();
    // localVideo.style.opacity = 0;
    // remoteVideo.style.opacity = 0;
    video.style.opacity = 0;
  },
  enterFullScreen: function () {
    //container.webkitRequestFullScreen();
  },

  maybePreferAudioSendCodec: function(sdp) {
    if (audio_send_codec == '') {
      console.log('No preference on audio send codec.');
      return sdp;
    }
    console.log('Prefer audio send codec: ' + audio_send_codec);
    return getPreferredAudioCodec(sdp, audio_send_codec);
  },
  maybePreferAudioReceiveCodec: function(sdp) {
    if (audio_receive_codec == '') {
      console.log('No preference on audio receive codec.');
      return sdp;
    }
    console.log('Prefer audio receive codec: ' + audio_receive_codec);
    return getPreferredAudioCodec(sdp, audio_receive_codec);
  },

  handleStartClick: function() {
    // here, need to make sure we request to be initiator
    // only one initiator at a time 
    initiator = 0;
    this.initialize();
    console.log("Start the broadcast and notify audiences!");
    this.sendMessage({type: 'broadcast'});
  },

  handleStopClick: function() {
    this.stop();
  },

  render: function() {
    return (
      <div className="panel panel-default broadcast">
        <video 
          className="broadcast_video" 
          ref="video"
          poster="http://static1.squarespace.com/static/511b9e98e4b0d00cab6bb783/547a5522e4b0306d2b1e2c5f/547a574de4b0d64f97a6a39f/1417303893172/buffering-animation.gif?">
        </video>
        <div className="btnrow">
          <button 
            className="btn btn-success btnstart" 
            onClick={this.handleStartClick}>
            START
          </button>
          <button 
            className="btn btn-success btnstop"
            onClick={this.handleStopClick}>
            STOP
          </button>
        </div>        
      </div>
    );
  }
});

module.exports = Broadcast;