var React = require('react');

require('./LoginButton.css');

const LOGIN_URL = '/user/login';

var LoginButton = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  propTypes: {
    redirect: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      redirect: null
    };
  },

  render: function() {
    var {redirect, ...otherProps} = this.props;
    var encodedRedirect = encodeURIComponent(
      redirect || this.context.router.getCurrentPath()
    );

    return (
      <a {...otherProps} href={`${LOGIN_URL}?redirect=${encodedRedirect}`}>
        Log in with <span className="LoginButton-twitter">Twitter</span>
      </a>
    );
  }

});

module.exports = LoginButton;