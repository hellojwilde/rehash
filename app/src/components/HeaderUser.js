var React = require('react');
var Button = require('components/Button');
var CreateModal = require('components/modals/CreateModal');

var ensureCurrentUser = require('helpers/ensureCurrentUser');
var userPropType = require('types/userPropType');

var HeaderUser = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.func.isRequired
  },

  propTypes: {
    currentUser: userPropType
  },

  getDefaultProps: function() {
    return {
      currentUser: null
    };
  },

  handleLoginClick: function() {
    ensureCurrentUser(this.context.flux);
  },

  handleCreateClick: function() {
    this.context.flux.getActions('modal').push(
      CreateModal,
      {
        onComplete: function() {}
      }
    );
  },

  handleLogoutClick: function() {
    this.context.flux.getActions('currentUser').logout();
  },

  render: function() {
    if (!this.props.currentUser) {
      return (
        <ul className="nav navbar-nav">
          <li>
            <Button onClick={this.handleLoginClick}>Login</Button>
          </li>
        </ul>
      );
    }

    return (
      <ul className="nav navbar-nav">
        <li>
          <button 
            onClick={this.handleCreateClick} 
            className="btn btn-primary btn-sm navbar-btn">
            <span className="glyphicon glyphicon-plus"></span>{' '}
            Create Event
          </button>
        </li>
        <li>
          <p className="navbar-text">{this.props.currentUser.name}</p>
        </li>
        <li>
          <Button onClick={this.handleLogoutClick}>Logout</Button>
        </li>
      </ul>
    )
  }

});

module.exports = HeaderUser;