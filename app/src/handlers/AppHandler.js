var React = require('react');
var LoginModal = require('components/login/LoginModal');
var Footer = require('components/Footer');
var {RouteHandler} = require('react-router');

var AppHandler = React.createClass({

  contextTypes: {
    router: React.PropTypes.object
  },

  render: function() {
    var {isLoginVisible} = this.context.router.getCurrentQuery();

    return (
      <div className="AppHandler">
        <RouteHandler/>
        <Footer/>
        <LoginModal isVisible={!!isLoginVisible} />
      </div>
    );
  }

});

module.exports = AppHandler;