var React = require('react');

var userPropType = require('types/userPropType');

var meetingPropType = React.PropTypes.shape({
  id: React.PropTypes.number.isRequired,
  title: React.PropTypes.string.isRequired,
  description: React.PropTypes.string.isRequired,
  start: React.PropTypes.object.isRequired,
  subscribers: React.PropTypes.arrayOf(userPropType).isRequired,
  attendees: React.PropTypes.arrayOf(userPropType).isRequired,
  status: React.PropTypes.oneOf(['scheduled', 'broadcasting', 'ended'])
});

module.exports = meetingPropType;