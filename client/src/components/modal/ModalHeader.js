var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var ModalHeader = React.createClass({

  propTypes: {
    onCancel: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <div className="modal-header">
        <button 
          className="close" 
          ariaLabel="Close" 
          onClick={this.props.onCancel}>
          <span ariaHidden="true">&times;</span>
        </button>

        <h4 className="modal-title">{this.props.children}</h4>
      </div>
    );
  }

});

module.exports = ModalHeader;