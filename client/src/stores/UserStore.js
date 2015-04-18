var {Store} = require('flummox');

class UserStore extends Store {
  constructor(registry) {
    super();

    var userActionIds = registry.getActionIds('user');

    this.register(userActionIds.fetch, this.handleUserFetch);

    this.registry = registry;
    this.state = {};
  }

  handleUserFetch(user) {
    this.setState({[user.id]: user});
  } 
}

module.exports = UserStore;