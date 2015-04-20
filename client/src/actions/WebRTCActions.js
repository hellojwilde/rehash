var {Actions} = require('flummox');

var invariant = require('react/lib/invariant');
var {RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, requestUserMedia} = require('helpers/WebRTCAdapter');
var {SDP_CONSTRAINTS, getMergedConstraints, getWithStereoIfPossible} = require('helpers/WebRTCConstraints');

class WebRTCActions extends Actions {
  constructor(registry, api) {
    super();
    
    this.registry = registry;
    this.api = api;
  }

  fetchTurn() {
    return Promise.resolve(null);

    // return new Promise((resolve, reject) => {
    //   var webRTCStore = this.registry.getStore('webRTC');
    //   var {pcConfig, turnUrl, isTurnFetchingComplete} = webRTCStore.state;

    //   // Ensure that we skip fetching turn if we already have it.
    //   if (isTurnFetchingComplete) {
    //     return resolve(null);
    //   }

    //   // Allow to skip turn by passing ts=false to apprtc.
    //   if (turnUrl == '') {
    //     return resolve(null);
    //   }

    //   for (var i = 0, len = pcConfig.iceServers.length; i < len; i++) {
    //     if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
    //       return resolve(null);
    //     }
    //   }

    //   resolve($.ajax({url: turnUrl, dataType: 'json'}));
    // });
  }

  prepareAsHost() {
    return requestUserMedia({audio: true, video: true});
  }

  connectAsHost(meetingId) {
    var webRTCActions = this.registry.getActions('webRTC');
    var webRTCStore = this.registry.getStore('webRTC');
    var {localStream} = webRTCStore.state;

    invariant(
      localStream && !localStream.ended,
      'WebRTCActions: no localStream found; did you call prepareAsHost first?'
    );

    return webRTCActions.fetchTurn()
      .then(() => webRTCActions._createPeer(localStream));
  }

  connectAsAttendee(meetingId) {
    var webRTCActions = this.registry.getActions('webRTC');

    return webRTCActions.fetchTurn()
      .then(() => {
        webRTCActions._createPeer();
        return webRTCActions._createPeerOffer();
      });
  }

  disconnect() {
    var webRTCStore = this.registry.getStore('webRTC');
    var meetingStore = this.registry.getStore('meeting');
    var {meetingId} = webRTCStore.state;

    if (meetingId) {
      var meetingRelation = meetingStore.getCurrentUserRelationById(meetingId);
      if (meetingRelation.isHost) {
        return this.api.broadcastEnd(meetingId);
      }
    }
    
    return Promise.resolve(null);
  }

  receiveMessage(meetingId, message) {
    var webRTCStore = this.registry.getStore('webRTC');
    var webRTCActions = this.registry.getActions('webRTC');

    invariant(
      webRTCStore.state.pc !== null,
      'PeerConnection must be started before receiving signaling messages.'
    );

    switch(message.type) {
      case 'offer':
        webRTCActions._receivePeerRemoteDescription(message);
        webRTCActions._createPeerAnswer();
        break;
      case 'answer':
        webRTCActions._receivePeerRemoteDescription(message);
        break;
      case 'candidate':
        webRTCActions._receivePeerIceCandidate(message);
        break;
    }
  }

  _createPeer(optLocalStream) {
    var webRTCActions = this.registry.getActions('webRTC');
    var webRTCStore = this.registry.getStore('webRTC');
    var {pcConfig, pcConstraints} = webRTCStore.state;

    var pc = new RTCPeerConnection(pcConfig, pcConstraints);

    if (optLocalStream) {
      pc.addStream(optLocalStream);
    }

    pc.onaddstream = webRTCActions._receivePeerRemoteStream;
    pc.onicecandidate = ({candidate}) => {
      // XXX This is fired when we've successfully added an ICE candidate
      // to this RTCPeerConnection instance. We use this to send a message
      // to the server when the candidate that we received has been added.

      if (!candidate) {
        return;
      }

      this.api.broadcastSendWebRTCMessage(
        webRTCStore.state.meetingId,
        {
          type: 'candidate',
          label: candidate.sdpMLineIndex,
          id: candidate.sdpMid,
          candidate: candidate.candidate
        }
      );

      // XXX Chrome will generate a lot of ICE candidates, but we only need
      // one. To simplify things, we're going to remove the event handler
      // once we've broadcasted one.
      
      pc.onicecandidate = null;
    };

    console.log(
      'Created RTCPeerConnnection with:\n' +
      '  config: \'' + JSON.stringify(pcConfig) + '\';\n' +
      '  constraints: \'' + JSON.stringify(pcConstraints) + '\'.'
    );
    
    return pc;
  }

  _createPeerOffer() {
    var webRTCStore = this.registry.getStore('webRTC');
    var {offerConstraints, pc} = webRTCStore.state;
    var constraints = getMergedConstraints(offerConstraints, SDP_CONSTRAINTS);
    
    console.log(
      'Sending offer to peer, with constraints: \n' +
      '  \'' + JSON.stringify(constraints) + '\'.'
    );

    return new Promise((resolve, reject) => {
      pc.createOffer(
        (sessionDescription) => {
          sessionDescription.sdp = 
            webRTCStore.getPreferredAudioReceiveCodec(sessionDescription.sdp);
          pc.setLocalDescription(sessionDescription)

          this.api.broadcastSendWebRTCMessage(
            webRTCStore.state.meetingId, 
            sessionDescription
          ).then(() => resolve(sessionDescription));
        }, 
        (e) => reject(e), 
        constraints
      );
    });
  }

  _createPeerAnswer() {
    var webRTCStore = this.registry.getStore('webRTC');
    var {pc, sdpConstraints} = webRTCStore.state;

    console.log('Sending answer to peer');

    return new Promise((resolve, reject) => {
      pc.createAnswer(
        (sessionDescription) => {
          sessionDescription.sdp = 
            webRTCStore.getPreferredAudioReceiveCodec(sessionDescription.sdp);
          pc.setLocalDescription(sessionDescription)

          this.api.broadcastSendWebRTCMessage(
            webRTCStore.state.meetingId, 
            sessionDescription
          ).then(() => resolve(sessionDescription));
        },
        (e) => reject(e), 
        SDP_CONSTRAINTS
      );
    }); 
  }

  _receivePeerIceCandidate(message) {
    return new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate
    });
  }

  _receivePeerRemoteDescription(message) {
    var webRTCStore = this.registry.getStore('webRTC');

    // Set Opus in Stereo, if stereo enabled.
    if (webRTCStore.state.stereo) {
      message.sdp = getWithStereoIfPossible(message.sdp);
    } else {
      message.sdp = webRTCStore.getPreferredAudioSendCodec(message.sdp);
    }

    return new RTCSessionDescription(message);
  }

  _receivePeerRemoteStream(event) {
    console.log(event);
    return event.stream;
  }
}

module.exports = WebRTCActions;