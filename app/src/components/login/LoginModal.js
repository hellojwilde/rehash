var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var LoginModal = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object
  },

  propTypes: {
    onCancel: React.PropTypes.func,
    onComplete: React.PropTypes.func,
    isVisible: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      onCancel: function() {},
      onComplete: function() {},
      isVisible: false
    };
  },

  handleLoginClick: function() {
    this.flux.getActions('currentUser').login();
  },

  render: function() {
    return (
      <div 
        className="modal" 
        style={this.props.isVisible ? {display: 'block'} : {}}>
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button 
                className="close" 
                ariaLabel="Close" 
                onClick={this.props.onCancel}>
                <span ariaHidden="true">&times;</span>
              </button>

              <h4 className="modal-title">Log In</h4>
            </div>

            <div className="modal-body">
              <button 
                onClick={this.handleLoginClick}
                className="btn btn-primary btn-lg btn-block">
                Log in with ExampleAPI
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = LoginModal;