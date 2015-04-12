var React = require('react');

require('./ExploreLayoutContent.css');

var ExploreLayoutContent = React.createClass({

  render: function() {
    return (
      <div {...this.props} className="ExploreLayoutContent"/>
    );
  }

});

module.exports = ExploreLayoutContent;