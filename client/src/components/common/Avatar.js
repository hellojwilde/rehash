var React = require('react');

var userPropType = require('types/userPropType');
var joinClasses = require('react/lib/joinClasses');

require('./Avatar.css');

var Avatar = React.createClass({

  propTypes: {
    user: userPropType.isRequired
  },

  render: function() {
    var {user, className, ...otherProps} = this.props;

    return (
      <img 
        {...otherProps}
        className={joinClasses('Avatar', className)}
        src={user.photoThumbnailUrl || user.photo_thumbnail_url}
        alt={user.name}
        title={user.name}
      />
    );
  }

});

module.exports = Avatar;