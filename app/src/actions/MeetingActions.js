var {Actions} = require('flummox');

class MeetingActions extends Actions {
  constructor(flux, api) {
    super();
    
    this.flux = flux;
    this.api = api;
  }

  fetch(meetingId) {
    return this.api.meetingFetch(meetingId);
  }

  join(meetingId) {
    return this.api.meetingJoin(meetingId);
  }

  create(meeting) {
    var currentUserStore = this.flux.getStore('currentUser');

    return this.api.meetingCreate(Object.assign(
      meeting,
      {host: currentUserStore.getCurrentUser()}
    ));
  }
}

module.exports = MeetingActions;
