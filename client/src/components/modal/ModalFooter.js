var React = require('react');

var ModalFooter = React.createClass({

  render: function() {
    return (
      <div className="modal-footer">
        {this.props.children}
      </div>
    );
  }

});

module.exports = ModalFooter;