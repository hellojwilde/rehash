var React = require('react');

var _ = require('lodash');
var joinClasses = require('react/lib/joinClasses');
var userPropType = require('types/userPropType');

require('./AttendeePreview.css');

var AttendeePreview = React.createClass({

  propTypes: {
    previewed: React.PropTypes.arrayOf(userPropType).isRequired,
    totalNumber: React.PropTypes.number.isRequired
  },

  render: function() {
    var {previewed, totalNumber, className, ...otherProps} = this.props;
    var thumbnails = previewed.map((attendee, idx) => (
      <img 
        key={idx}
        className="AttendeePreview-thumbnail"
        alt={`${attendee.name} (avatar)`} 
        src={attendee.photoThumbnailUrl}
      />
    ));

    if (totalNumber > previewed.length) {
      thumbnails.push(
        <div key="placeholder" className="AttendeePreview-placeholder">
          + {totalNumber - previewed.length}
        </div>
      );
    }

    return (
      <div 
        {...otherProps}
        className={joinClasses('AttendeePreview', className)}>
        {thumbnails}
      </div>
    );
  }

});

module.exports = AttendeePreview;