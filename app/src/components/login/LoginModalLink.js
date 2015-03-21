var React = require('react');
var {Link} = require('react-router');

var LoginModalLink = React.createClass({

  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  render: function() {
    var routes = this.context.router.getCurrentRoutes(),
        route = routes[routes.length - 1].name,
        params = this.context.router.getCurrentParams(),
        query = this.context.router.getCurrentQuery();

    query.isLoginVisible = 'true';

    return (
      <Link to={route} params={params} query={query}>
        {this.props.children}
      </Link>
    );
  }

});

module.exports = LoginModalLink;