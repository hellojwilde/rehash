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

    this.state = {
      channelToken: null,
      user: null
    };
  }
}

module.exports = CurrentUserStore;
