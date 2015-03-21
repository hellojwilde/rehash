var {Actions} = require('flummox');

class ModalActions extends Actions {
  push(component, props) {
    return {
      component: component,
      props: props
    };
  }

  pop() {
    return {};
  }
}

module.exports = ModalActions;
