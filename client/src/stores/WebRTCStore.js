var {Store} = require('flummox');

var {createIceServers} = require('helpers/WebRTCAdapter');
var {getPreferredAudioCodec} = require('helpers/WebRTCConstraints');
var _ = require('lodash');
var invariant = require('react/lib/invariant');

class WebRTCStore extends Store {
  static deserialize(json) {
    return json;
  }

  static serialize(state) {
    return state;
  }

  constructor(registry) {
    super();

    var webRTCActionIds = registry.getActionIds('webRTC');

    this.register(webRTCActionIds.prepareAsHost, this.handleWebRTCPrepareAsHost);
    this.register(webRTCActionIds.receiveMessage, this.handleWebRTCReceiveMessage);
    this.register(webRTCActionIds._fetchTurn, this.handleWebRTCFetchTurn);
    this.register(webRTCActionIds._createPeer, this.handleWebRTCCreatePeer);
    this.register(webRTCActionIds._receivePeerRemoteStream, this.handleWebRTCReceivePeerRemoteStream)

    this.registry = registry;
    this.state = {
      // State variables representing mostly immutable server configuration.
      audioReceiveCodec: null,
      audioSendCodec: null,
      mediaConstraints: null,
      offerConstraints: null,
      pcConfig: null,
      pcConstraints: null,
      stereo: null,
      turnUrl: null,

      // State variables representing client status.
      isMeetingHost: null,
      isTurnFetchingComplete: false,
      localStream: null,
      meetingKey: null,
      pc: null,
      remoteStream: null
    };
  }

  getPreferredAudioSendCodec(sdp) {
    if (audioSendCodec == '') {
      console.log('No preference on audio send codec.');
      return sdp;
    }
    console.log('Prefer audio send codec: ' + audioSendCodec);
    return getPreferredAudioCodec(sdp, audioSendCodec);
  }

  getPreferredAudioReceiveCodec(sdp) {
    if (audioReceiveCodec == '') {
      console.log('No preference on audio receive codec.');
      return sdp;
    }
    console.log('Prefer audio receive codec: ' + audioReceiveCodec);
    return getPreferredAudioCodec(sdp, audioReceiveCodec);
  }

  handleWebRTCPrepareAsHost(stream) {
    this.setState({localStream: stream});
  }

  handleWebRTCReceiveMessage(message) {
    invariant(
      this.state.pc !== null,
      'PeerConnection must be started before receiving signalling messages.'
    );

    // Since the turn response is async and also GAE might disorder the
    // message delivery due to possible datastore query at server side,
    // So callee needs to cache messages before peerConnection is created.

    switch(message.type) {
      case 'offer':
        this.setRemote(message);
        this.doAnswer();
        break;
      case 'answer':
        this.setRemote(message);
        break;
      case 'candidate':
        var candidate = new RTCIceCandidate({
          sdpMLineIndex: message.label,
          candidate: message.candidate
        });

        pc.addIceCandidate(
          candidate,
          this.onAddIceCandidateSuccess, 
          this.onAddIceCandidateError
        );
        break;
    }
  }

  handleWebRTCFetchTurn(turnServer) {
    if (turnServer === null) {
      this.setState({isTurnFetchingComplete: true});
      return;
    }

    var {uris, username, password} = turnServer;
    var iceServers = createIceServers(uris, username, password);

    if (iceServers !== null) {
      this.setState({
        isTurnFetchingComplete: true,
        pcConfig: _.clone(this.state.pcConfig).iceServers.concat(iceServers)
      });
    }
  }

  handleWebRTCCreatePeer(pc) {
    this.setState({pc: pc})
  }

  handleWebRTCReceivePeerRemoteStream(stream) {
    this.setState({remoteStream: stream});
  }
}

module.exports = WebRTCStore;