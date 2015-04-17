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
var hasLocalStream
var localStream;
var remoteStream;
var pc;
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
    meetingKey: React.PropTypes.number.isRequired
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
  onCreateSessionDescriptionError: function(error) {
    this.messageError('Failed to create session description: ' + error.toString());
  },
  onSetSessionDescriptionSuccess: function() {
    console.log('Set session description success.');
  },
  onSetSessionDescriptionError: function(error) {
    this.messageError('Failed to set session description: ' + error.toString());
  },
  onRemoteStreamAdded: function(event) {
    var video = this.refs['video'].getDOMNode();
    console.log('Remote stream added.');
    attachMediaStream(video, event.stream);
    remoteStream = event.stream;
    video.play();
    this.sendMessage({type:'connected'});
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

// exports for ChannelAPI only
module.exports = {
  Broadcast_onChannelMessage: Broadcast.onChannelMessage,
  Broadcast_onChannelOpened: Broadcast.onChannelOpened,
  Broadcast: Broadcast
};






