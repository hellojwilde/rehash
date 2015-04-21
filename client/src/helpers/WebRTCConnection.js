var {
  RTCPeerConnection, 
  RTCIceCandidate, 
  RTCSessionDescription
} = require('helpers/WebRTCAdapter');

var {
  SDP_CONSTRAINTS, 
  getMergedConstraints, 
  getWithStereoIfPossible
} = require('helpers/WebRTCConstraints');

var EventEmitter = require('eventemitter3');

class WebRTCConnection extends EventEmitter {
  constructor(registry, api, otherPeer) {
    super()

    this.registry = registry;
    this.api = api;
    this.otherPeer = otherPeer;
    this.iceCandidates = [];

    this._createPeerConnection();
  }

  addStream(localStream) {
    this.peer.addStream(localStream);
  }

  sendOffer() {
    var webRTCStore = this.registry.getStore('webRTC');
    var {offerConstraints} = webRTCStore.state;
    var constraints = getMergedConstraints(offerConstraints, SDP_CONSTRAINTS);
    
    console.log(
      'Sending offer to peer, with constraints: \n' +
      '  \'' + JSON.stringify(constraints) + '\'.'
    );

    this.peer.createOffer(
      this._setLocalAndSendSessionDescription.bind(this),
      (e) => console.error(e), 
      constraints
    );
  }

  receiveMessage(message) {
    switch(message.type) {
      case 'offer':
        this._receiveSessionDescription(message);
        this._sendAnswer();
        break;
      case 'answer':
        this._receiveSessionDescription(message);
        break;
      case 'candidate':
        this._receiveIceCandidate(message);
        break;
    }
  }

  disconnect() {
    this.peer.close();
  }

  _createPeerConnection() {
    var webRTCStore = this.registry.getStore('webRTC');
    var {pcConfig, pcConstraints} = webRTCStore.state;

    this.peer = new RTCPeerConnection(pcConfig, pcConstraints);
    this.peer.onicecandidate = 
      ({candidate}) => this._sendIceCandidate(candidate);
    this.peer.onaddstream = ({stream}) => {
      this.emit('addStream', stream)
    };

    console.log(
      'Created RTCPeerConnnection with:\n' +
      '  config: \'' + JSON.stringify(pcConfig) + '\';\n' +
      '  constraints: \'' + JSON.stringify(pcConstraints) + '\'.'
    );
  }

  _sendAnswer() {
    console.log(
      'Sending answer to peer, with constraints: \n' +
      '  \'' + JSON.stringify(SDP_CONSTRAINTS) + '\'.'
    );

    this.peer.createAnswer(
      this._setLocalAndSendSessionDescription.bind(this),
      (e) => console.error(e), 
      SDP_CONSTRAINTS
    );
  }

  _setLocalAndSendSessionDescription(sessionDescription) {
    var currentUserStore = this.registry.getStore('currentUser');
    var webRTCStore = this.registry.getStore('webRTC');

    sessionDescription.sdp = 
      webRTCStore.getPreferredAudioReceiveCodec(sessionDescription.sdp);

    this.peer.setLocalDescription(sessionDescription)
    this.api.webRTCSendMessage(
      currentUserStore.state.connectedUserId,
      this.otherPeer, 
      sessionDescription
    );
  }

  _sendIceCandidate(candidate) {
    if (!candidate) {
      return;
    }

    var currentUserStore = this.registry.getStore('currentUser');

    this.api.webRTCSendMessage(
      currentUserStore.state.connectedUserId,
      this.otherPeer,
      {
        type: 'candidate',
        label: candidate.sdpMLineIndex,
        id: candidate.sdpMid,
        candidate: candidate.candidate
      }
    );
  }

  _receiveSessionDescription(message) {
    var webRTCStore = this.registry.getStore('webRTC');

    // Set Opus in Stereo, if stereo enabled.
    if (webRTCStore.state.stereo) {
      message.sdp = getWithStereoIfPossible(message.sdp);
    }
    message.sdp = webRTCStore.getPreferredAudioSendCodec(message.sdp);

    this.peer.setRemoteDescription(new RTCSessionDescription(message));
  }

  _receiveIceCandidate(message) {
    this.peer.addIceCandidate(new RTCIceCandidate({
      sdpMLineIndex: message.label,
      sdpMid: message.id,
      candidate: message.candidate
    }));
  }
}

module.exports = WebRTCConnection;