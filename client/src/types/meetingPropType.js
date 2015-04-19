var React = require('react');

var meetingPropType = React.PropTypes.shape({
  key: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  start: React.PropTypes.object.isRequired
});

module.exports = meetingPropType;