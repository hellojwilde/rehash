var {Store} = require('flummox');

function getSetFromArray(arr) {
  return arr.reduce(function(set, item) {
    set[item] = true;
    return set;
  }, {});
}

function getSetWith(set, item) {
  set[item] = true;
  return set;
}

function isInSet(set, item) {
  return !!set[item];
}

class CurrentUserStore extends Store {
  constructor(flux) {
    super();

    var currentUserActionIds = flux.getActionIds('currentUser'),
        meetingActionIds = flux.getActionIds('meeting');

    this.register(currentUserActionIds.login, this.handleCurrentUserLogin);
    this.register(currentUserActionIds.logout, this.handleCurrentUserLogout);
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
    return isInSet(this.state.participating, meetingId);
  }

  isHost(meetingId) {
    return isInSet(this.state.hosting, meetingId);
  }

  handleCurrentUserLogin(login) {
    var {user, participating, hosting} = login;

    this.setState({
      user: user,
      participating: getSetFromArray(participating),
      hosting: getSetFromArray(hosting)
    });
  }

  handleCurrentUserLogout() {
    this.setState({
      user: null, 
      participating: {},
      hosting: {}
    });
  }

  handleMeetingJoin(meetingId) {
    this.setState({
      participating: getSetWith(this.state.participating, meetingId)
    });
  }

  handleMeetingCreate(meetingId) {
    this.setState({
      participating: getSetWith(this.state.participating, meetingId),
      hosting: getSetWith(this.state.hosting, meetingId)
    });
  }
}

module.exports = CurrentUserStore;
