var {Actions} = require('flummox');

class ModalActions extends Actions {
  push(component, onComplete, onCancel) {
    return {
      component: component,
      onComplete: onComplete,
      onCancel: onCancel
    };
  }

  pop() {
    return {};
  }
}

module.exports = ModalActions;
