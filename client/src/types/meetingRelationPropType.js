var React = require('react');

var meetingRelationPropType = React.PropTypes.shape({
  isHost: React.PropTypes.bool.isRequired,
  isAttendee: React.PropTypes.bool.isRequired
});

module.exports = meetingRelationPropType;
