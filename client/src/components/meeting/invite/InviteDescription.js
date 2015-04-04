var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./InviteDescription.css');

var InviteDescription = React.createClass({

  propTypes: {
    description: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <div className="panel panel-default InviteDescription">
        <div className="panel-body">
          <p className="lead">
            {this.props.description}
          </p>
        </div>
      </div>
    );
  }

});

module.exports = InviteDescription;