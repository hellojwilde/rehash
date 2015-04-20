var WebRTCConnection = require('./WebRTCConnection');

var _ = require('lodash');

class WebRTCBroadcaster {
  constructor(registry, api, localStream) {
    this.registry = registry;
    this.api = api;
    this.localStream = localStream;
    this.connections = {};
  }

  receiveMessage(sender, message) {
    switch (message.type) {
      case 'offer-request':
        this._createConnection(sender);
        break;
      default:
        this.connections[sender].receiveMessage(message);
        break;
    }
  }

  disconnect() {
    _.forEach(
      this.connections, 
      (transmitter) => transmitter.disconnect()
    );
  }

  _createConnection(otherPeer) {
    var conn = new WebRTCConnection(
      this.registry,
      this.api,
      otherPeer
    );

    conn.addStream(this.localStream);
    conn.sendOffer();

    this.connections[otherPeer] = conn;
  }
}

module.exports = WebRTCBroadcaster;