var {Store} = require('flummox');

class CurrentUserStore extends Store {
  constructor(flux) {
    super();

    var currentUserActionIds = flux.getActionIds('currentUser'),
        meetingActionIds = flux.getActionIds('meeting');

    this.register(currentUserActionIds.login, this.handleCurrentUserLogin);
    this.register(currentUserActionIds.logout, this.handleCurrentUserLogout);
    this.register(meetingActionIds.join, this.handleMeetingJoin);

    this.state = {
      user: null,
      joinedMeetingIds: {}
    };
  }

  getCurrentUser() {
    return this.state.user;
  }

  isJoined(meetingId) {
    return !!this.state.joinedMeetingIds[meetingId];
  }

  handleCurrentUserLogin(user, joinedMeetingIds) {
    this.setState({
      user: user,
      joinedMeetingIds: joinedMeetingIds.reduce(function(set, meetingId) {
        set[meetingId] = true;
        return set;
      }, {})
    });
  }

  handleCurrentUserLogout() {
    this.setState({user: null, joined: {}});
  }

  handleMeetingJoin(meetingId) {
    var joined = this.state.joined;
    joined[meetingId] = true;
    this.setState({joined: joined});
  }
}

module.exports = CurrentUserStore;
