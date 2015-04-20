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
    var currentUserStore = this.registry.getStore('currentUser');

    return webRTCActions.connectAsHost()
      .then(() => this.api.broadcastStart(
        currentUserStore.state.connectedUserId, 
        meetingId
      ));
  }

  end(meetingId) {
    return this.api.broadcastEnd(meetingId)
      .then(() => meetingId);
  }

  receiveStart(broadcast) {
    var webRTCActions = this.registry.getActions('webRTC');

    return webRTCActions.connectAsAttendee(broadcast.hostConnectedUser)
      .then(() => broadcast);
  }

  receiveEnd(meetingId) {
    var webRTCActions = this.registry.getActions('webRTC');
    webRTCActions.disconnect();
    return meetingId;
  }
}

module.exports = BroadcastActions;
