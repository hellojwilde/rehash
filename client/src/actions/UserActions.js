var {Actions} = require('flummox');

class UserActions extends Actions {
  constructor(registry, api) {
    super();
    
    this.registry = registry;
    this.api = api;
  }

  fetch(userId) {
    var userStore = this.registry.getStore('user');
    var user = userStore.getById(userId);
    if (user) {
      return Promise.resolve(user);
    }

    return this.api.userFetch(userId);
  }
}

module.exports = UserActions;