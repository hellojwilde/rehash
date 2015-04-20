var React = require('react');

var userPropType = require('types/userPropType');
var meetingStatusPropType = require('types/meetingStatusPropType');

var meetingPropType = React.PropTypes.shape({
  id: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  start: React.PropTypes.object.isRequired,
  subscribers: React.PropTypes.arrayOf(userPropType).isRequired,
  attendees: React.PropTypes.arrayOf(userPropType).isRequired,
  status: meetingStatusPropType.isRequired
});

module.exports = meetingPropType;