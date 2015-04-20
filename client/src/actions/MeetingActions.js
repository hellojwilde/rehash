var {Actions} = require('flummox');

var _ = require('lodash');

class MeetingActions extends Actions {
  constructor(registry, api) {
    super();
    
    this.registry = registry;
    this.api = api;
  }

  fetch(meetingId) {
    var meetingStore = this.registry.getStore('meeting');
    var meeting = meetingStore.getById(meetingId);
    if (meeting) {
      return Promise.resolve(meeting);
    }

    return this.api.meetingFetch(meetingId);
  }

  create(meeting) {
    var currentUserStore = this.registry.getStore('currentUser');

    return this.api.meetingCreate(meeting);
  }

  update(meetingId, meeting) {
    return this.api.meetingUpdate(meetingId, meeting);
  }

  subscribe(meetingId) {
    return this.api.meetingSubscribe(meetingId);
  }

  open(meetingId) {
    return this.api.meetingOpen(meetingId);
  }

  close(meetingId) {
    return this.api.meetingClose(meetingId);
  }

  broadcastStart(meetingId) {
    return this.api.broadcastStart(meetingId)
      .then(() => meetingId);
  }

  broadcastEnd(meetingId) {
    return this.api.broadcastEnd(meetingId)
      .then(() => meetingId);
  }

  receive(meeting) {
    return meeting;
  }

  receiveBroadcastStart(meetingId) {
    return meetingId;
  }

  receiveBroadcastEnd(meetingId) {
    return meetingId;
  }
}

module.exports = MeetingActions;
