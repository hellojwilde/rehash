var {Store} = require('flummox');

var _ = require('lodash');

class CurrentUserStore extends Store {
  static deserialize(json) {
    return json;
  } 

  constructor(registry) {
    super();

    var meetingActionIds = registry.getActionIds('meeting');

    this.register(meetingActionIds.join, this.handleMeetingJoin);
    this.register(meetingActionIds.create, this.handleMeetingCreate);

    this.state = {
      user: null,
      participating: {},
      hosting: {}
    };
  }

  getCurrentUser() {
    return this.state.user;
  }

  isParticipant(meetingId) {
    return _.has(this.state.participating, meetingId);
  }

  isHost(meetingId) {
    return _.has(this.state.hosting, meetingId);
  }

  handleMeetingJoin(meetingId) {
    this.setState({
      participating: _.assign(this.state.participating, {meetingId: true})
    });
  }

  handleMeetingCreate(meetingId) {
    this.setState({
      participating: _.assign(this.state.participating, {meetingId: true}),
      hosting: _.assign(this.state.hosting, {meetingId: true})
    });
  }
}

module.exports = CurrentUserStore;
