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
    Promise.resolve(this.context.flux.getActions('currentUser').login())
      .then(() => this.props.onComplete());
  },

  render: function() {
    return (
      <div className="modal" style={{display: 'block'}}>
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
              {this.props.message && (
                <p>{this.props.message}</p>
              )}

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