var React = require('react');

var userPropType = React.PropTypes.shape({
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  photoThumbnailUrl: React.PropTypes.string.isRequired
});

module.exports = userPropType;