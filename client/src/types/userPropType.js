var React = require('react');

var userPropType = React.PropTypes.shape({
  key: React.PropTypes.string.isRequired,
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  photoThumbnailUrl: React.PropTypes.string.isRequired
});

module.exports = userPropType;