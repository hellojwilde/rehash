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

    this.register(webRTCActionIds._createPeer, this.handleWebRTCCreatePeer);
    this.register(webRTCActionIds._createPeerOffer, this.handleWebRTCCreateLocalDescription);
    this.register(webRTCActionIds._createPeerAnswer, this.handleWebRTCCreateLocalDescription);
    this.register(webRTCActionIds._createPeerLocalStream, this.handleWebRTCCreatePeerLocalStream);
    this.register(webRTCActionIds._receivePeerRemoteStream, this.handleWebRTCReceivePeerRemoteStream)
    this.register(webRTCActionIds._receivePeerRemoteDescription, this.handleWebRTCReceivePeerRemoteDescription);

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

  handleWebRTCCreatePeer(pc) {
    this.setState({pc: pc})
  }

  handleWebRTCCreatePeerLocalStream(stream) {
    this.state.pc.addStream(stream);
  }

  handleWebRTCCreateLocalDescription(sessionDescription) {
    this.state.pc.setLocalDescription(sessionDescription);
  }

  handleWebRTCReceivePeerRemoteStream(stream) {
    this.setState({remoteStream: stream});
  }

  handleWebRTCReceivePeerRemoteDescription(sessionDescription) {
    this.state.pc.setRemoteDescription(sessionDescription);
  }

  handleWebRTCReceiveIceCandidate(candidate) {
    this.state.pc.addIceCandidate(candidate);
  }
}

module.exports = WebRTCStore;