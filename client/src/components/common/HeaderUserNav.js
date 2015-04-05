var React = require('react');
var Button = require('components/common/Button');
var CreateModal = require('modals/CreateModal');

var ensureCurrentUser = require('helpers/ensureCurrentUser');
var userPropType = require('types/userPropType');

var HeaderUserNav = React.createClass({

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
    ensureCurrentUser(
      this.context.flux, 
      'In order to create a new meeting, we\'ll need you to log in.'
    ).then(() => {
      this.context.flux.getActions('modal').push(
        CreateModal,
        {
          onComplete: (meetingId) => {
            console.log(meetingId);
            this.context.router.transitionTo(
              'meeting-invite',
              {meetingId: meetingId}
            )
          }
        }
      );
    });
  },

  handleLogoutClick: function() {
    this.context.flux.getActions('currentUser').logout();
  },

  render: function() {
    var buttons = {};

    buttons['create'] = (
      <li>
        <button 
          onClick={this.handleCreateClick} 
          className="btn btn-primary btn-sm navbar-btn">
          Create Meeting
        </button>
      </li>
    );

    if (this.props.currentUser) {
      buttons['user'] = (
        <li>
          <p className="navbar-text">{this.props.currentUser.name}</p>
        </li>
      );

      buttons['logout'] = (
        <li>
          <Button onClick={this.handleLogoutClick}>Logout</Button>
        </li>
      );
    } else {
      buttons['login'] = (
        <li>
          <Button onClick={this.handleLoginClick}>Login</Button>
        </li>
      );
    }

    return (
      <ul className="nav navbar-nav">
        {buttons}
      </ul>
    )
  }

});

module.exports = HeaderUserNav;