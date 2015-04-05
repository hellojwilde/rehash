var React = require('react/addons');
var HeaderLink = require('components/common/HeaderLink');
var CreateModal = require('modals/CreateModal');

var createFragment = React.addons.createFragment;
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
          <p className="navbar-text">
            {this.props.currentUser.name}
          </p>
        </li>
      );

      buttons['logout'] = (
        <HeaderLink onClick={this.handleLogoutClick}>Logout</HeaderLink>
      );
    } else {
      buttons['login'] = (
        <HeaderLink onClick={this.handleLoginClick}>Login</HeaderLink>
      );
    }

    return (
      <ul className="nav navbar-nav">
        {createFragment(buttons)}
      </ul>
    )
  }

});

module.exports = HeaderUserNav;