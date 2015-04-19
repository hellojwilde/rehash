var {Actions} = require('flummox');

var _ = require('lodash');

class MeetingActions extends Actions {
  constructor(registry, api) {
    super();
    
    this.registry = registry;
    this.api = api;
  }

  fetch(meetingKey) {
    var meetingStore = this.registry.getStore('meeting');
    var meeting = meetingStore.getByKey(meetingKey);
    if (meeting) {
      return Promise.resolve(meeting);
    }

    return this.api.meetingFetch(meetingKey);
  }

  create(meeting) {
    var currentUserStore = this.registry.getStore('currentUser');

    return this.api.meetingCreate(meeting);
  }

  update(meetingKey, meeting) {
    return this.api.meetingUpdate(meetingKey, meeting);
  }

  subscribe(meetingKey) {
    return this.api.meetingSubscribe(meetingKey);
  }

  open(meetingId) {
    return this.api.meetingOpen(meetingId);
  }

  close(meetingId) {
    return this.api.meetingClose(meetingId);
  }
}

module.exports = MeetingActions;
