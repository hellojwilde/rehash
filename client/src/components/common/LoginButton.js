var React = require('react');

require('./LoginButton.css');

var LoginButton = React.createClass({

  render: function() {
    return (
      <a {...this.props} href="/user/login">
        Log in with <span className="LoginButton-twitter">Twitter</span>
      </a>
    );
  }

});

module.exports = LoginButton;