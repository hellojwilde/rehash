var Modal = require('components/modals/Modal');
var ModalBody = require('components/modals/ModalBody');
var ModalHeader = require('components/modals/ModalHeader');
var React = require('react');

var CreateModal = React.createClass({

  propTypes: {
    onComplete: React.PropTypes.func,
    onCancel: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      onComplete: function() {},
      onCancel: function() {}
    };
  },

  render: function() {
    return (
      <Modal>
        <ModalHeader onCancel={this.props.onCancel}>Create Event</ModalHeader>
        <ModalBody>
          (Form should go here.)
        </ModalBody>
      </Modal>
    );
  }

});

module.exports = CreateModal;