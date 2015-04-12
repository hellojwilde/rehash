var React = require('react');

var cardPropType = React.PropTypes.shape({
  id: React.PropTypes.number.isRequired,
  userId: React.PropTypes.string,
  topic: React.PropTypes.string,
  content: React.PropTypes.string.isRequired
});

module.exports = cardPropType;