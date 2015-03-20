var {Actions} = require('flummox');

class CurrentUserActions extends Actions {
  constructor(api) {
    super();
    this.api = api;
  }

  // TODO: Figure out a credential to support here.
  login() {
    return this.api.currentUserLogin();
  }

  logout() {
    return this.api.currentUserLogout();
  }
}

module.exports = CurrentUserActions;
