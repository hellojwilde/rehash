var React = require('react');

var meetingPropType = React.PropTypes.shape({
  id: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  start: React.PropTypes.object.isRequired
});

module.exports = meetingPropType;