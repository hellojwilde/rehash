var Modal = require('components/modal/Modal');
var ModalBody = require('components/modal/ModalBody');
var ModalHeader = require('components/modal/ModalHeader');
var LoginButton = require('components/common/LoginButton');
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
      <Modal>
        <ModalHeader onCancel={this.props.onCancel}>Log In</ModalHeader>
        <ModalBody>
          {this.props.message && (
            <p className="alert alert-info">{this.props.message}</p>
          )}

          <LoginButton className="btn btn-primary btn-lg btn-block"/>
        </ModalBody>
      </Modal>
    );
  }

});

module.exports = LoginModal;