var {Store} = require('flummox');

var {createIceServers} = require('helpers/WebRTCAdapter');
var {getPreferredAudioCodec} = require('helpers/WebRTCConstraints');
var _ = require('lodash');

const DEFAULT_FETCH_STATE = {
  isTurnFetchingComplete: false
};

const DEFAULT_MEETING_STATE = {
  localStream: null,
  remoteStream: null,
  broadcaster: null,
  receiver: null
};

class WebRTCStore extends Store {
  static deserialize(state) {
    return _.assign(
      state, 
      DEFAULT_FETCH_STATE,
      DEFAULT_MEETING_STATE
    );
  }

  static serialize(state) {
    return state;
  }

  constructor(registry) {
    super();

    var webRTCActionIds = registry.getActionIds('webRTC');

    this.register(webRTCActionIds.fetchTurn, this.handleFetchTurn);
    this.register(webRTCActionIds.prepareAsHost, this.handlePrepareAsHost);
    this.register(webRTCActionIds.connectAsHost, this.handleConnectAsHost);
    this.register(webRTCActionIds.connectAsAttendee, this.handleConnectAsAttendee);
    this.register(webRTCActionIds.receiveRemoteStream, this.handleReceiveRemoteStream);
    this.register(webRTCActionIds.disconnect, this.handleDisconnect);

    this.registry = registry;
    this.state = _.assign({
      // State variables representing mostly immutable server configuration.
      audioReceiveCodec: null,
      audioSendCodec: null,
      mediaConstraints: null,
      offerConstraints: null,
      pcConfig: null,
      pcConstraints: null,
      stereo: null,
      turnUrl: null
    }, DEFAULT_FETCH_STATE, DEFAULT_MEETING_STATE);
  }

  getPreferredAudioSendCodec(sdp) {
    var {audioSendCodec} = this.state;
    if (audioSendCodec == '') {
      return sdp;
    } else {
      return getPreferredAudioCodec(sdp, audioSendCodec);
    }
  }

  getPreferredAudioReceiveCodec(sdp) {
    var {audioReceiveCodec} = this.state;
    if (audioReceiveCodec == '') {
      return sdp;
    } else {
      return getPreferredAudioCodec(sdp, audioReceiveCodec);
    }
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

  handlePrepareAsHost(localStream) {
    this.setState({localStream});
  }

  handleConnectAsHost(broadcaster) {
    this.setState({broadcaster});
  }

  handleConnectAsAttendee(receiver) {
    this.setState({receiver});
  }

  handleReceiveRemoteStream(remoteStream) {
    this.setState({remoteStream});
  }

  handleDisconnect() {
    var {localStream, broadcaster, receiver} = this.state;

    localStream && localStream.stop();
    broadcaster && broadcaster.disconnect();
    receiver && receiver.disconnect();

    this.setState(DEFAULT_MEETING_STATE);
  }
}

module.exports = WebRTCStore;