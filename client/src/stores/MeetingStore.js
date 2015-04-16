var {Store} = require('flummox');

var _ = require('lodash');
var moment = require('moment');

class MeetingStore extends Store {
  constructor(registry) {
    super();

    var exploreActionIds = registry.getActionIds('explore');
    var meetingActionIds = registry.getActionIds('meeting');
    
    this.register(exploreActionIds.fetch, this.handleExploreFetch);
    this.register(meetingActionIds.fetch, this.handleMeetingFetch);
    this.register(meetingActionIds.create, this.handleMeetingCreate);

    this.state = {};
  }

  getAll() {
    return _.values(this.state);
  }

  getByKey(meetingKey) {
    return this.state[meetingKey];
  }

  handleExploreFetch(meetings) {
    this.setState(_.indexBy(meetings, 'key'));
  }

  handleMeetingFetch(meeting) {
    this.setState({[meeting.key]: meeting});
  }

  handleMeetingCreate(meeting) {
    this.setState({[meeting.key]: meeting})
  }
}

module.exports = MeetingStore;
