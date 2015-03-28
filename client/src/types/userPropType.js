var React = require('react');

var userPropType = React.PropTypes.shape({
  id: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  photoThumbnailUrl: React.PropTypes.string.isRequired
});

module.exports = userPropType;