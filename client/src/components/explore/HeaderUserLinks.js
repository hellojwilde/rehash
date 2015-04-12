var React = require('react/addons');
var CreateButton = require('components/common/CreateButton');
var LoginButton = require('components/common/LoginButton');

var _ = require('lodash');
var userPropType = require('types/userPropType');
var {createFragment} = React.addons;

var HeaderUserLinks = React.createClass({

  propTypes: {
    currentUser: userPropType
  },

  getDefaultProps: function() {
    return {
      currentUser: null
    };
  },

  render: function() {
    var buttons = {
      create: <li><CreateButton className="navbar-btn"/></li>
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
        login: <li><LoginButton/></li>
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