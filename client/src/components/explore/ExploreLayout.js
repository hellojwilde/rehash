var React = require('react');

require('./ExploreLayout.css');

var ExploreLayout = React.createClass({

  render: function() {
    return (
      <div {...this.props} className="ExploreLayout"/>
    );
  }

});

module.exports = ExploreLayout;