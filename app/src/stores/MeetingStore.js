var {Store} = require('flummox');

class MeetingStore extends Store {
  constructor(flux) {
    super();

    var meetingActionIds = flux.getActionIds('meeting');

    this.register(meetingActionIds.fetch, this.handleMeetingFetch);

    this.state = {};
  }

  getById(meetingId) {
    return this.state[meetingId];
  }

  handleMeetingFetch(meeting) {
    this.setState({
      [meeting.id]: meeting
    });
  }
}

module.exports = MeetingStore;
