var React = require('react');

var meetingPropType = React.PropTypes.shape({
  id: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  start: React.PropTypes.object.isRequired,
  isBroadcasting: React.PropTypes.bool.isRequired
});

module.exports = meetingPropType;