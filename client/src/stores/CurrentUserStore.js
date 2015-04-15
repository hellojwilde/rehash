var {Store} = require('flummox');

var _ = require('lodash');

class CurrentUserStore extends Store {
  static deserialize(json) {
    return json;
  }

  static serialize(state) {
    return state;
  }

  constructor(registry) {
    super();

    var meetingActionIds = registry.getActionIds('meeting');

    this.register(meetingActionIds.join, this.handleMeetingJoin);
    this.register(meetingActionIds.create, this.handleMeetingCreate);

    this.state = {
      user: null,
      attending: {},
      hosting: {}
    };
  }

  getCurrentUser() {
    return this.state.user;
  }

  isAttendee(meetingId) {
    return _.has(this.state.attending, meetingId);
  }

  isHost(meetingId) {
    return _.has(this.state.hosting, meetingId);
  }

  handleMeetingJoin(meetingId) {
    this.setState({
      attending: _.assign(this.state.attending, {meetingId: true})
    });
  }

  handleMeetingCreate(meetingId) {
    this.setState({
      attending: _.assign(this.state.attending, {meetingId: true}),
      hosting: _.assign(this.state.hosting, {meetingId: true})
    });
  }
}

module.exports = CurrentUserStore;
