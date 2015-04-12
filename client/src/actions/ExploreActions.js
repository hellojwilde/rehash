var {Actions} = require('flummox');

class ExploreActions extends Actions {
  constructor(registry, api) {
    super();

    this.registry = registry; 
    this.api = api;
  }

  fetch() {
    return this.api.exploreFetch();
  }
}

module.exports = ExploreActions;