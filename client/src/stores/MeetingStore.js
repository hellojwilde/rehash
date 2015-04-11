var {Store} = require('flummox');

var _ = require('lodash');
var moment = require('moment');

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

  handleMeetingsFetch(meetings) {
    this.setState(meetings);
  }

  handleMeetingFetch(meeting) {
    this.setState({
      [meeting.id]: meeting
    });
  }
}

module.exports = MeetingStore;
