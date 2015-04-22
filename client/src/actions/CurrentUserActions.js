var {Actions} = require('flummox');

class CurrentUserActions extends Actions {
  constructor(registry, api) {
    super();

    this.registry = registry;
    this.api = api;
  }

  connectedUserFetch() {
    return this.api.connectedUserFetch();
  }
}

module.exports = CurrentUserActions;