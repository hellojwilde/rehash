var React = require('react/addons');
var CreateModal = require('modals/CreateModal');

var _ = require('lodash');
var ensureCurrentUser = require('helpers/ensureCurrentUser');
var userPropType = require('types/userPropType');
var {createFragment} = React.addons;

var HeaderUserLinks = React.createClass({

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

  handleCreateClick: function() {
    ensureCurrentUser(
      this.context.flux, 
      'In order to create a new meeting, we\'ll need you to log in.'
    );
  },

  render: function() {
    var buttons = {
      create: (
        <li>
          <button 
            onClick={this.handleCreateClick} 
            className="btn btn-default navbar-btn">
            <span 
              aria-hidden="true" 
              className="glyphicon glyphicon-plus">
            </span>
            {' '}
            Create Rehash
          </button>
        </li>
      )
    };

    if (this.props.currentUser) {
      _.assign(buttons, {
        user: (
          <li>
            <p className="navbar-text">
              {this.props.currentUser.name}
            </p>
          </li>
        ),
        logout: <li><a href="/user/logout">Log out</a></li>
      });
    } else {
      _.assign(buttons, {
        login: <li><a href="/user/login">Log in</a></li>
      });
    }

    return (
      <ul className="nav navbar-nav">
        {createFragment(buttons)}
      </ul>
    )
  }

});

module.exports = HeaderUserLinks;