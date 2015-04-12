var {Store} = require('flummox');

var _ = require('lodash');
var moment = require('moment');

class MeetingStore extends Store {
  constructor(registry) {
    super();

    var meetingActionIds = registry.getActionIds('meeting');
    var exploreActionIds = registry.getActionIds('explore');

    this.register(meetingActionIds.fetch, this.handleMeetingFetch);
    this.register(exploreActionIds.fetch, this.handleExploreFetch);

    this.state = {};
  }

  getAll() {
    return _.values(this.state);
  }

  getById(meetingId) {
    return this.state[meetingId];
  }

  handleExploreFetch(meetings) {
    this.setState(meetings);
  }

  handleMeetingFetch(meeting) {
    this.setState({
      [meeting.id]: meeting
    });
  }
}

module.exports = MeetingStore;
