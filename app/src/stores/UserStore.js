var {Store} = require('flummox');

class UserStore extends Store {
  constructor(flux) {
    super();

    var currentUserActions = flux.getActions('currentUser'),
        userActions = flux.getActions('user');

    this.register(currentUserActions.login, this.handleCurrentUserLogin);
    this.register(userActions.fetch, this.handleUserFetch);

    this.state = {};
  }

  handleCurrentUserLogin(user) {

  }

  handleUserFetch(user) {

  }
}

module.exports = UserStore;