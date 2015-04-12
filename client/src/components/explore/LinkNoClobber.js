var React = require('react');
var {Link} = require('react-router');

var _ = require('lodash');

var LinkNoClobber = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render: function() {
    var {query, ...otherProps} = this.props;
    var currentQuery = this.context.router.getCurrentQuery();

    return (
      <Link 
        {...otherProps} 
        query={_.assign({}, currentQuery, query || {})}
      />
    );
  }

});

module.exports = LinkNoClobber;