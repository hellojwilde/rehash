var {Store} = require('flummox');

class MeetingStore extends Store {
  constructor(flux) {
    super();

    var meetingActions = flux.getActions('meeting');

    this.register(meetingActions.fetch, this.handleMeetingFetch);
    this.register(meetingActions.fetchSummary, this.handleMeetingFetchSummary);

    this.state = {};
  }

  handleMeetingFetch() {
    
  }

  handleMeetingFetchSummary() {

  }
}

module.exports = MeetingStore;
