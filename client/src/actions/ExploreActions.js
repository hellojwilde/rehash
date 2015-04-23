var {Actions} = require('flummox');

class ExploreActions extends Actions {
  constructor(registry, api) {
    super();

    this.registry = registry; 
    this.api = api;
  }

  fetch() {
    var exploreStore = this.registry.getStore('explore');
    if (!exploreStore.isExpired()) {
      return Promise.resolve(null);
    }

    return this.api.exploreFetch();
  }
}

module.exports = ExploreActions;