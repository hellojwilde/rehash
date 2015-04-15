var {createIceServers} = require('helpers/WebRTCAdapter');
var {Store} = require('flummox');

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

    this.register(
      webRTCActionIds.fetchTurnIfNeeded, 
      this.handleWebRTCFetchTurnIfNeeded
    );

    this.state = {
      pcConfig: null,
      pcConstraints: null,
      offerConstraints: null,
      mediaConstraints: null,
      turnUrl: null,
      stereo: null,
      audioSendCodec: null,
      audioReceiveCodec: null,
    };
  }

  handleWebRTCFetchTurnIfNeeded(turnServer) {
    if (turnServer === null) {
      return;
    }

    var {uris, username, password} = turnServer;
    var iceServers = createIceServers(uris, username, password);

    if (iceServers !== null) {
      this.setState({
        pcConfig: _.clone(this.state.pcConfig).iceServers.concat(iceServers)
      });
    }
  }
}

module.exports = WebRTCStore;