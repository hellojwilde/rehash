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
      joined: {}
    };
  }

  getCurrentUser() {
    return this.state.user;
  }

  isJoined(meetingId) {
    return !!this.state.joined[meetingId];
  }

  handleCurrentUserLogin(login) {
    var {user, joinedMeetingIds} = login;

    this.setState({
      user: user,
      joined: joinedMeetingIds.reduce(function(set, meetingId) {
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
