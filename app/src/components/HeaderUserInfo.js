var React = require('react');
var {Link} = require('react-router');

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
            <a 
              href="#"
              role="button"
              onClick={this.handleLoginClick}>
              Login
            </a>
          </li>
        </ul>
      );
    }

    return (
      <ul className="nav navbar-nav">
        <li><p className="navbar-text">{this.props.currentUser.name}</p></li>
        <li>
          <a 
            href="#" 
            role="button" 
            onClick={this.handleLogoutClick}>
            Logout
          </a>
        </li>
      </ul>
    )
  }

});

module.exports = HeaderUserInfo;