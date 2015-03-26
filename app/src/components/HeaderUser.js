var React = require('react');
var Button = require('components/Button');

var ensureCurrentUser = require('helpers/ensureCurrentUser');

var HeaderUserInfo = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    currentUser: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired
    }).isRequired
  },

  handleLoginClick: function(e) {
    e.preventDefault();
    ensureCurrentUser(this.context.flux);
  },

  handleLogoutClick: function(e) {
    e.preventDefault();
    this.context.flux.getActions('currentUser').logout();
  },

  render: function() {
    if (!this.props.currentUser) {
      return (
        <ul className="nav navbar-nav">
          <li>
            <Button onClick={this.handleLoginClick}>
              Login
            </Button>
          </li>
        </ul>
      );
    }

    return (
      <ul className="nav navbar-nav">
        <li><p className="navbar-text">{this.props.currentUser.name}</p></li>
        <li>
          <Button onClick={this.handleLogoutClick}>
            Logout
          </Button>
        </li>
      </ul>
    )
  }

});

module.exports = HeaderUserInfo;