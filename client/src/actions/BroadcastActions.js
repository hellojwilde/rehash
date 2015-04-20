var {Actions} = require('flummox');

class BroadcastActions extends Actions {
  constructor(registry, api) {
    super();

    this.registry = registry;
    this.api = api;
  }

  fetch(meetingId) {
    return this.api.broadcastFetch(meetingId);
  }

  start(meetingId) {
    var webRTCActions = this.registry.getActions('webRTC');
    return webRTCActions.connectAsHost()
      .then(() => this.api.broadcastStart(meetingId));
  }

  end(meetingId) {
    return this.api.broadcastEnd(meetingId);
  }

  receiveStart(broadcast) {
    return broadcast;
  }
}

module.exports = BroadcastActions;
