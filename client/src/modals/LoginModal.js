var Modal = require('components/modal/Modal');
var ModalBody = require('components/modal/ModalBody');
var ModalHeader = require('components/modal/ModalHeader');
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

  render: function() {
    return (
      <Modal className="modal-sm">
        <ModalHeader onCancel={this.props.onCancel}>Log In</ModalHeader>
        <ModalBody>
          {this.props.message && (
            <p>{this.props.message}</p>
          )}

          <a 
            href="/user/login"
            className="btn btn-primary btn-lg btn-block">
            Log in with Twitter
          </a>
        </ModalBody>
      </Modal>
    );
  }

});

module.exports = LoginModal;