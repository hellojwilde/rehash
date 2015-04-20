var {Store} = require('flummox');

class BroadcastStore extends Store {
  constructor(registry) {
    super();

    var broadcastActionIds = registry.getActionIds('broadcast');

    this.register(broadcastActionIds.fetch, this.handleReceive);
    this.register(broadcastActionIds.start, this.handleReceive);

    this.registry = registry;
    this.state = {};
  }

  getById(id) {
    return this.state[id];
  }

  handleReceive(broadcast) {
    this.setState({[broadcast.id]: broadcast})
  }
}

module.exports = BroadcastStore;