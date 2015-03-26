var {Store} = require('flummox');

class ModalStore extends Store {
  constructor(flux) {
    super();

    var modalActionIds = flux.getActionIds('modal');

    this.register(modalActionIds.push, this.handleModalPush);
    this.register(modalActionIds.pop, this.handleModalPop);

    this.state = {
      stack: []
    };
  }

  getStack() {
    return this.state.stack;
  }

  handleModalPush(modal) {
    this.setState({
      stack: this.state.stack.concat(modal)
    });
  }

  handleModalPop() {
    this.setState({
      stack: this.state.stack.slice(0, -1)
    });
  }
}

module.exports = ModalStore;
