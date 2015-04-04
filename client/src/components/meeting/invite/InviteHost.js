var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./InviteHost.css');

var InviteHost = React.createClass({

  propTypes: {
    id: React.PropTypes.number.isRequired,
    photoUrl: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    bio: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <div className="panel panel-default InviteHost">
        <div className="panel-heading InviteHost-heading">
          {this.props.name}
        </div>

        <img 
          src={this.props.photoUrl} 
          alt={`${this.props.name} (photo)`}
          className="img-responsive"
        />

        <div className="panel-body" id="container">
          <p>{this.props.bio}</p>
        </div>
      </div>
    );
  }
});

module.exports = InviteHost;
