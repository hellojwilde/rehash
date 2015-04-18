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

  join(meetingKey) {
    return this.api.meetingJoin(meetingKey);
  }

  create(meeting) {
    var currentUserStore = this.registry.getStore('currentUser');

    return this.api.meetingCreate(meeting);
  }

  update(meetingKey, meeting) {
    return this.api.meetingUpdate(meetingKey, meeting);
  }
}

module.exports = MeetingActions;
