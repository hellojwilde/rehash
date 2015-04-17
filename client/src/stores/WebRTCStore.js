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

    this.register(webRTCActionIds.fetchTurn, this.handleWebRTCFetchTurn);
    this.register(webRTCActionIds.prepareAsHost, this.handleWebRTCPrepareAsHost);
    this.register(webRTCActionIds.disconnect, this.handleWebRTCDisconnect);

    this.register(webRTCActionIds._createOffer, this.handleWebRTCCreateLocalDescription);
    this.register(webRTCActionIds._createAnswer, this.handleWebRTCCreateLocalDescription);
    this.register(webRTCActionIds._receiveRemoteSessionDescription, this.handleWebRTCReceiveRemoteSessionDescription)
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

  handleWebRTCDisconnect() {
    var {localStream, pc} = this.state;

    localStream.stop();
    pc.close();

    this.setState({
      localStream: null,
      meetingKey: null,
      pc: null,
      remoteStream: null
    });
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

  handleWebRTCReceiveRemoteSessionDescription(sessionDescription) {
    this.state.pc.setRemoteDescription(sessionDescription);
  }

  handleWebRTCCreateLocalDescription(sessionDescription) {
    this.state.pc.setLocalDescription(sessionDescription);
  }

  handleWebRTCReceiveIceCandidate(candidate) {
    this.state.pc.addIceCandidate(candidate);
  }

  handleWebRTCCreatePeer(pc) {
    this.setState({pc: pc})
  }

  handleWebRTCReceivePeerRemoteStream(stream) {
    this.setState({remoteStream: stream});
  }
}

module.exports = WebRTCStore;