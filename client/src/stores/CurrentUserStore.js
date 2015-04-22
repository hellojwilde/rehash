var {Store} = require('flummox');

class CurrentUserStore extends Store {
  static deserialize(json) {
    return json;
  }

  static serialize(state) {
    return state;
  }

  constructor(registry) {
    super();

    var currentUserActionIds = registry.getActionIds('currentUser');

    this.register(
      currentUserActionIds.connectedUserFetch, 
      this.handleConnectedUserFetch
    );

    this.registry = registry;
    this.state = {
      channelToken: null,
      connectedUserId: null,
      user: null
    };
  }

  handleConnectedUserFetch(connectedUser) {
    this.setState(connectedUser);
  }
}

module.exports = CurrentUserStore;
