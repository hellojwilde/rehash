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
      channelToken: null,
      user: null,
      attending: {},
      hosting: {}
    };
  }

  getCurrentUser() {
    return this.state.user;
  }

  isAttendee(meetingKey) {
    return _.has(this.state.attending, meetingKey);
  }

  isHost(meetingKey) {
    return _.has(this.state.hosting, meetingKey);
  }

  handleMeetingJoin(meetingKey) {
    this.setState({
      attending: _.assign(this.state.attending, {meetingKey: true})
    });
  }

  handleMeetingCreate(meetingKey) {
    this.setState({
      attending: _.assign(this.state.attending, {meetingKey: true}),
      hosting: _.assign(this.state.hosting, {meetingKey: true})
    });
  }
}

module.exports = CurrentUserStore;
