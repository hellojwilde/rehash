var {Store} = require('flummox');

class ModalStore extends Store {
  constructor(registry) {
    super();

    var modalActionIds = registry.getActionIds('modal');

    this.register(modalActionIds.push, this.handleModalPush);
    this.register(modalActionIds.pop, this.handleModalPop);

    this.registry = registry;
    this.state = {
      stack: []
    };
  }

  getStack() {
    return this.state.stack;
  }

  handleModalPush(modal) {
    this.setState({stack: this.state.stack.concat(modal)});
  }

  handleModalPop() {
    this.setState({stack: this.state.stack.slice(0, -1)});
  }
}

module.exports = ModalStore;
