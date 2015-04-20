var {Store} = require('flummox');

var {createIceServers} = require('helpers/WebRTCAdapter');
var {getPreferredAudioCodec} = require('helpers/WebRTCConstraints');
var _ = require('lodash');

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
    var webRTCActionBindings = [
      // Public facing actions.
      ['fetchTurn', this.handleFetchTurn],
      ['prepareAsHost', this.handlePrepareAsHost],
      ['connectAsHost', [this.handleConnectBegin]],
      ['connectAsAttendee', [this.handleConnectBegin]],
      ['disconnect', this.handleDisconnect],

      // Internal actions regarding signaling and RTCPeerConnection.
      ['_createPeer', this.handleCreatePeer],
      ['_receivePeerIceCandidate', this.handleReceivePeerIceCandidate],
      ['_receivePeerRemoteDescription', this.handleReceivePeerRemoteDescription],
      ['_receivePeerRemoteStream', this.handleReceivePeerRemoteStream]
    ];

    webRTCActionBindings.forEach(([action, handler]) => {
      if (_.isArray(handler)) {
        this.registerAsync(webRTCActionIds[action], handler[0]);
      } else {
        this.register(webRTCActionIds[action], handler);
      }
    });

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
      meetingId: null,
      isMeetingHost: false,
      pc: null,
      remoteStream: null
    };
  }

  getPreferredAudioSendCodec(sdp) {
    var {audioSendCodec} = this.state;
    if (audioSendCodec == '') {
      console.log('No preference on audio send codec.');
      return sdp;
    }
    console.log('Prefer audio send codec: ' + audioSendCodec);
    return getPreferredAudioCodec(sdp, audioSendCodec);
  }

  getPreferredAudioReceiveCodec(sdp) {
    var {audioReceiveCodec} = this.state;
    if (audioReceiveCodec == '') {
      console.log('No preference on audio receive codec.');
      return sdp;
    }
    console.log('Prefer audio receive codec: ' + audioReceiveCodec);
    return getPreferredAudioCodec(sdp, audioReceiveCodec);
  }

  handlePrepareAsHost(stream) {
    this.setState({localStream: stream});
  }

  handleConnectBegin(meetingId) {
    this.setState({meetingId: meetingId});
  }

  handleDisconnect() {
    var {localStream, pc} = this.state;

    localStream && localStream.stop();
    pc && pc.close();

    this.setState({
      localStream: null,
      meetingId: null,
      pc: null,
      remoteStream: null
    });
  }

  handleFetchTurn(turnServer) {
    if (turnServer === null) {
      this.setState({isTurnFetchingComplete: true});
      return;
    }

    var {uris, username, password} = turnServer;
    var iceServers = createIceServers(uris, username, password);

    if (iceServers !== null) {
      var {pcConfig} = this.state;
      pcConfig.iceServers = pcConfig.iceServers.concat(iceServers);

      this.setState({
        isTurnFetchingComplete: true,
        pcConfig: pcConfig
      });
    }
  }

  handleCreatePeer(pc) {
    this.setState({pc: pc})
  }

  handleReceivePeerIceCandidate(candidate) {
    this.state.pc.addIceCandidate(candidate);
  }

  handleReceivePeerRemoteDescription(sessionDescription) {
    this.state.pc.setRemoteDescription(sessionDescription);
  }

  handleReceivePeerRemoteStream(stream) {
    this.setState({remoteStream: stream});
  }
}

module.exports = WebRTCStore;