var {Actions} = require('flummox');
var getFirstFrame = require('helpers/getFirstFrame');

class BroadcastActions extends Actions {
  constructor(registry, api, uploadApi) {
    super();

    this.registry = registry;
    this.api = api;
    this.uploadApi = uploadApi;
  }

  fetch(meetingId) {
    return this.api.broadcastFetch(meetingId);
  }

  start(meetingId) {
    var webRTCActions = this.registry.getActions('webRTC');
    var webRTCStore = this.registry.getStore('webRTC');
    var {localStream} = webRTCStore.state; 
    var currentUserStore = this.registry.getStore('currentUser');

    return webRTCActions.connectAsHost()
      .then(() => {
        return Promise.all([
          this.api.broadcastStart(
            currentUserStore.state.connectedUserId, 
            meetingId
          ),
          getFirstFrame(localStream)
            .then((frame) => (
              this.uploadApi.uploadFirstFrame(
                currentUserStore.state.connectedUserId,
                meetingId, 
                frame
              )
            ))
        ]).then(([broadcast]) => broadcast);
      });
  }

  selectCard(meetingId, topicId, questionId) {
    return this.api.selectCard(
      currentUserStore.state.connectedUserId,
      topicId,
      questionId
    ).then(() => {meetingId, topicId, questionId});
  }

  end(meetingId) {
    var currentUserStore = this.registry.getStore('currentUser');

    return this.api.broadcastEnd(
      currentUserStore.state.connectedUserId,
      meetingId
    ).then(() => meetingId);
  }

  receiveStart(broadcast) {
    var currentMeetingStore = this.registry.getStore('currentMeeting');
    var webRTCActions = this.registry.getActions('webRTC');

    if (+currentMeetingStore.state.meetingId == broadcast.id) {
      return webRTCActions.connectAsAttendee(broadcast.hostConnectedUser)
        .then(() => broadcast);
    }
    return broadcast;
  }

  receiveSelectCard(broadcast) {
    return broadcast;
  }

  receiveEnd(meetingId) {
    var webRTCActions = this.registry.getActions('webRTC');
    webRTCActions.disconnect();
    return meetingId;
  }
}

module.exports = BroadcastActions;
