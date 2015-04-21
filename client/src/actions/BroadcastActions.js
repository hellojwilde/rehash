var {Actions} = require('flummox');
var {attachMediaStream} = require('helpers/WebRTCAdapter');
var ExampleAPI = require('apis/ExampleAPI');

function getFirstFrame(localStream) {
  var videoNode = document.createElement('video');
  videoNode.videowidth = 720;
  videoNode.videoheight = 480;
  videoNode.autoPlay = true;
  attachMediaStream(videoNode, localStream);

  var width = videoNode.videowidth;
  var height = videoNode.videoheight;
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');

  context.fillRect(0, 0, width, height);
  context.drawImage(videoNode, 0, 0, width, height);  
  return canvas.toDataURL('image/png');
}

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
    var webRTCStore = this.registry.getStore('webRTC');
    var {localStream} = webRTCStore.state; 
    var currentUserStore = this.registry.getStore('currentUser');

    return webRTCActions.connectAsHost()
      .then(() => {
        return Promise.all([
          this.api.broadcastStart(
            currentUserStore.state.connectedUserId, 
            meetingId
          )//,
          //ExampleAPI.uploadSendMessage(getFirstFrame(localStream))
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
