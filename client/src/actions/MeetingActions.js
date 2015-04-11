var {Actions} = require('flummox');

var _ = require('lodash');

class MeetingActions extends Actions {
  constructor(registry, api) {
    super();
    
    this.registry = registry;
    this.api = api;
  }

  fetch(meetingId) {
    return this.api.meetingFetch(meetingId);
  }

  join(meetingId) {
    return this.api.meetingJoin(meetingId);
  }

  create(meeting) {
    var currentUserStore = this.registry.getStore('currentUser');

    return this.api.meetingCreate(_.assign(
      meeting,
      {host: currentUserStore.getCurrentUser()}
    ));
  }
}

module.exports = MeetingActions;
