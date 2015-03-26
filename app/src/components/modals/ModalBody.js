var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var ModalBody = React.createClass({

  render: function() {
    return (
      <div className="modal-body">
        {this.props.children}
      </div>
    );
  }

});

module.exports = ModalBody;