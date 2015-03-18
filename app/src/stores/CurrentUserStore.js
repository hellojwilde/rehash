var {Store} = require('flummox');

class CurrentUserStore extends Store {
  constructor(flux) {
    super();

    var currentUserActions = flux.getActions('currentUser');

    this.register(currentUserActions.login, this.handleCurrentUserLogin);
    this.register(currentUserActions.logout, this.handleCurrentUserLogout);

    this.state = {
      userId: null
    };
  }

  getCurrentUserId() {
    return this.state.userId;
  }

  getCurrentUser() {
    
  }

  handleCurrentUserLogin(user, joined) {
    this.setState({userId: user.userId});
  }

  handleCurrentUserLogout() {
    this.setState({userId: null});
  }
}

module.exports = CurrentUserStore;