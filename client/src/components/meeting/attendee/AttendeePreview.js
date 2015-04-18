var React = require('react');

var _ = require('lodash');
var userPropType = require('types/userPropType');

require('./AttendeePreview.css');

var AttendeePreview = React.createClass({

  propTypes: {
    previewed: React.PropTypes.arrayOf(userPropType).isRequired,
    totalNumber: React.PropTypes.number.isRequired
  },

  renderThumbnailsEmpty: function() {
    return <p>No attendees...yet!</p>
  },

  renderThumbnails: function() {
    var {previewed, totalNumber} = this.props;
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
  },

  render: function() {
    return (
      <div className="AttendeePreview">
        {this.props.previewed.length > 0 
          ? this.renderThumbnails() 
          : this.renderThumbnailsEmpty()}
      </div>
    );
  }

});

module.exports = AttendeePreview;