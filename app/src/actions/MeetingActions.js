var {Actions} = require('flummox');

class MeetingActions extends Actions {
  constructor(api) {
    super();
    this.api = api;
  }

  fetch(meetingId) {
    return this.api.meetingFetch(meetingId);
  }

  join(meetingId) {
    return this.api.meetingJoin(meetingId);
  }
}

module.exports = MeetingActions;
