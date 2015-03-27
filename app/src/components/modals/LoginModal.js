var Modal = require('components/modals/Modal');
var ModalBody = require('components/modals/ModalBody');
var ModalHeader = require('components/modals/ModalHeader');
var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var LoginModal = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object
  },

  propTypes: {
    message: React.PropTypes.string,
    onComplete: React.PropTypes.func,
    onCancel: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      message: null,
      onComplete: function() {},
      onCancel: function() {}
    };
  },

  handleLoginClick: function() {
    this.context.flux.getActions('currentUser').login()
      .then(() => this.props.onComplete());
  },

  render: function() {
    return (
      <Modal className="modal-sm">
        <ModalHeader onCancel={this.props.onCancel}>Log In</ModalHeader>
        <ModalBody>
          {this.props.message && (
            <p>{this.props.message}</p>
          )}

          <button 
            onClick={this.handleLoginClick}
            className="btn btn-primary btn-lg btn-block">
            Log in with ExampleAPI
          </button>
        </ModalBody>
      </Modal>
    );
  }

});

module.exports = LoginModal;