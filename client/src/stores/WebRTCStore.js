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

    this.register(webRTCActionIds.fetchTurn, this.handleWebRTCFetchTurn);

    this.registry = registry;
    this.state = {
      pcConfig: null,
      pcConstraints: null,
      offerConstraints: null,
      mediaConstraints: null,
      turnUrl: null,
      stereo: null,
      audioSendCodec: null,
      audioReceiveCodec: null,
      isTurnFetchingComplete: false
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

  handleWebRTCReceiveMessage(message) {
    
  }
}

module.exports = WebRTCStore;