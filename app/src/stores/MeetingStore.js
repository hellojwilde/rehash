var {Store} = require('flummox');

class MeetingStore extends Store {
  constructor(flux) {
    super();

    var meetingActions = flux.getActions('meeting');

    this.register(meetingActions.fetch, this.handleMeetingFetch);

    this.state = {};
  }

  handleMeetingFetch() {
    
  }
}

module.exports = MeetingStore;
