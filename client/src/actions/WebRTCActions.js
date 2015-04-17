var {Actions} = require('flummox');

var {requestUserMedia} = require('helpers/WebRTCAdapter');

class WebRTCActions extends Actions {
  constructor(registry, api) {
    super();
    
    this.registry = registry;
    this.api = api;
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

    return webRTCActions._fetchTurn()
      .then(() => {
        webRTCActions._createPeer();
      });
  }

  connectAsAttendee(meetingKey) {
    return webRTCActions._fetchTurn()
      .then(() => {
        webRTCActions._createPeer();
      });
  }

  disconnect() {
    return null;
  }

  receiveMessage(message) {
    return message;
  }

  _fetchTurn() {
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

  _createPeer() {
    var webRTCActions = this.registry.getActions('webRTC');
    var webRTCStore = this.registry.getStore('webRTC');
    var {pcConfig, pcConstraints} = webRTCStore.state;

    var pc = new RTCPeerConnection(pcConfig, pcConstraints);
    pc.onicecandidate = webRTCActions.receivePeerIceCandidate;
    pc.onaddstream = this.onRemoteStreamAdded;
    pc.onremovestream = this.onRemoteStreamRemoved;

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