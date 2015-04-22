var {Actions} = require('flummox');

const INITIAL_DELAY = 100;
const MAX_DELAY = 100000;
const TRY_MULTIPLIER = 2;

class CurrentUserActions extends Actions {
  constructor(registry, api) {
    super();

    this.registry = registry;
    this.api = api;
  }

  connectedUserFetch() {
    return new Promise((resolve, reject) => {
      var delay = INITIAL_DELAY;
      var fetch = () => setTimeout(() => {
        delay = Math.min(delay * TRY_MULTIPLIER, MAX_DELAY);
        this.api.connectedUserFetch()
          .then(resolve, fetch);
      }, delay);

      fetch();
    });
  }
}

module.exports = CurrentUserActions;