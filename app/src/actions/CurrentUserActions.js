var {Actions} = require('flummox');

class CurrentUserActions extends Actions {
  // TODO: Figure out a credential to support here.
  login(credential) {
    // TODO: Actually do a call against the API and return a promise.
    // Should return a full user blob to integrate into the UserStore.
  }

  logout() {
    // TODO: Actually do a call against the API and return a promise.
  }
}

module.exports = CurrentUserActions;
