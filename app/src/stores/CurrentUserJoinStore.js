var {Store} = require('flummox');

class CurrentUserJoinStore extends Store {
  constructor(flux) {
    super();

    var currentUserActions = flux.getActions('currentUser'),
        meetingActions = flux.getActions('meeting');

    this.register(currentUserActions.login, this.handleCurrentUserLogin);
    this.register(currentUserActions.logout, this.handleCurrentUserLogout);
    this.register(meetingActions.join, this.handleMeetingJoin);

    this.state = {joined: {}};
  }

  isCurrentUserJoined(meetingId) {
    return !!this.state.joined[meetingId];
  }

  handleCurrentUserLogin(user, joined) {
    this.setState({
      joined: joined.reduce(function (set, meetingId) {
        set[meetingId] = true;
        return set;
      }, {})
    });
  }

  handleCurrentUserLogout() {
    this.setState({joined: {}});
  }

  handleMeetingJoin(meetingId) {
    var joined = this.state.joined;
    joined[meetingId] = true;
    this.setState({joined: joined});
  }
}

module.exports = CurrentUserJoinStore;