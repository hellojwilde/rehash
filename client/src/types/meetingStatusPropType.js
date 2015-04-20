var React = require('react');

var meetingStatusPropType = 
  React.PropTypes.oneOf(['scheduled', 'broadcasting', 'ended']);

module.exports = meetingStatusPropType;