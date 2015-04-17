var {Actions} = require('flummox');

var {requestUserMedia} = require('helpers/WebRTCAdapter');
var {SDP_CONSTRAINTS, mergeConstraints} = require('helpers/WebRTCConstraints');

class WebRTCActions extends Actions {
  constructor(registry, api) {
    super();
    
    this.registry = registry;
    this.api = api;
  }

  fetchTurn() {
    return new Promise((resolve, reject) => {
      var webRTCStore = this.registry.getStore('webRTC');
      var {pcConfig, turnUrl, isTurnFetchingComplete} = webRTCStore.state;

      // Ensure that we skip fetching turn if we already have it.
      if (isTurnFetchingComplete) {
        return resolve(null);
      }

      // Allow to skip turn by passing ts=false to apprtc.
      if (turnUrl == '') {
        return resolve(null);
      }

      for (var i = 0, len = pcConfig.iceServers.length; i < len; i++) {
        if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
          return resolve(null);
        }
      }

      var currentDomain = document.domain;
      if (currentDomain.search('localhost') === -1 &&
          currentDomain.search('apprtc') === -1) {
        // Not authorized domain. Try with default STUN instead.
        return resolve(null);
      }

      // TODO: check out this part 
      return resolve(null);
      //return $.ajax({url: turnUrl, dataType: 'json'});
    });
  }

  prepareAsHost(meetingKey) {
    return requestUserMedia({audio: true, video: true});
  }

  connectAsHost(meetingKey) {
    var webRTCActions = this.registry.getActions('webRTC');
    var webRTCStore = this.registry.getStore('webRTC');

    invariant(
      webRTCStore.state.localStream && !webRTCStore.state.localStream.ended,
      'WebRTCActions: no localStream found; did you call prepareAsHost first?'
    );

    return webRTCActions.fetchTurn()
      .then(() => {
        webRTCActions._createPeer();

        // TODO: attach local stream to peer connection.
        // TODO: send message saying to fetch all of the messages for the client.
      });
  }

  connectAsAttendee(meetingKey) {
    return webRTCActions.fetchTurn()
      .then(() => {
        webRTCActions._createPeer();
        webRTCActions._createOffer();
      });
  }

  disconnect() {
    return null;
  }

  receiveMessage(message) {
    var webRTCStore = this.registry.getStore('webRTC');
    var webRTCActions = this.registry.getActions('webRTCActions');

    invariant(
      webRTCStore.state.pc !== null,
      'PeerConnection must be started before receiving signalling messages.'
    );

    switch(message.type) {
      case 'offer':
        webRTCActions._receiveSessionDescription(message);
        webRTCActions._createAnswer();
        break;
      case 'answer':
        webRTCActions._receiveRemoteSessionDescription(message);
        break;
      case 'candidate':
        webRTCActions._receiveIceCandidate(message);
        break;
    }
  }

  _createOffer() {
    return new Promise((resolve, reject) => {
      var webRTCStore = this.registry.getStore('webRTC');
      var {offerConstraints} = webRTCStore.state;

      var constraints = mergeConstraints(offerConstraints, SDP_CONSTRAINTS);

      console.log(
        'Sending offer to peer, with constraints: \n' +
        '  \'' + JSON.stringify(constraints) + '\'.'
      );

      pc.createOffer(
        (sessionDescription) => {
          sessionDescription.sdp = 
            webRTCStore.getPreferredAudioReceiveCodec(sessionDescription.sdp);
          
          this.api.sendMessage(meetingKey, sessionDescription)
            .then(() => resolve(sessionDescription));
        }, 
        (e) => reject(e), 
        constraints
      );
    });
  }

  _createAnswer() {
    return new Promise((resolve, reject) => {
      var webRTCStore = this.registry.getStore('webRTC');
      var {pc, sdpConstraints, meetingKey} = webRTCStore.state;

      pc.createAnswer(
        (sessionDescription) => {
          sessionDescription.sdp = 
            webRTCStore.getPreferredAudioReceiveCodec(sessionDescription.sdp);
          
          this.api.sendMessage(meetingKey, sessionDescription)
            .then(() => resolve(sessionDescription));
        },
        (e) => reject(e), 
        SDP_CONSTRAINTS
      );
    }); 
  }

  _receiveRemoteSessionDescription(message) {
    var webRTCStore = this.registry.getStore('webRTC');

    // Set Opus in Stereo, if stereo enabled.
    if (webRTCStore.state.stereo) {
      message.sdp = getWithStereoIfPossible(message.sdp);
    } else {
      message.sdp = webRTCStore.getPreferredAudioSendCodec(message.sdp);
    }

    return new RTCSessionDescription(message);
  }

  _receiveIceCandidate(message) {
    return new RTCIceCandidate({
      sdpMLineIndex: message.label,
      candidate: message.candidate
    });
  }

  _createPeer() {
    var webRTCActions = this.registry.getActions('webRTC');
    var webRTCStore = this.registry.getStore('webRTC');
    var {pcConfig, pcConstraints} = webRTCStore.state;

    var pc = new RTCPeerConnection(pcConfig, pcConstraints);
    pc.onicecandidate = webRTCActions._receivePeerIceCandidate;
    pc.onaddstream = webRTCActions._receivePeerRemoteStream;

    console.log(
      'Created RTCPeerConnnection with:\n' +
      '  config: \'' + JSON.stringify(pcConfig) + '\';\n' +
      '  constraints: \'' + JSON.stringify(pcConstraints) + '\'.'
    );
    
    return pc;
  }

  _receivePeerIceCandidate(event) {
    var webRTCStore = this.registry.getStore('webRTC');
    var {candidate} = event;

    if (candidate) {
      this.api.sendMessage(
        webRTCStore.state.meetingKey,
        {
          type: 'candidate',
          label: candidate.sdpMLineIndex,
          id: candidate.sdpMid,
          candidate: candidate.candidate
        }
      );
    } else {
      console.log('End of candidates.');
    }

    return candidate;
  }

  _receivePeerRemoteStream(event) {
    return event.stream;
  }
}

module.exports = WebRTCActions;