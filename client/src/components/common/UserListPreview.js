var React = require('react');

var _ = require('lodash');
var userPropType = require('types/userPropType');

require('./UserListPreview.css');

var UserListPreview = React.createClass({

  propTypes: {
    emptyLabel: React.PropTypes.string.isRequired,
    attendeesToPreview: React.PropTypes.arrayOf(userPropType).isRequired,
    attendeeCount: React.PropTypes.number.isRequired
  },

  renderThumbnailsEmpty: function() {
    return <p>{this.props.emptyLabel}</p>
  },

  renderThumbnails: function() {
    var {attendeesToPreview, attendeeCount} = this.props;
    var thumbnails = attendeesToPreview.map((attendee, idx) => (
      <img 
        key={idx}
        className="UserListPreview-thumbnail"
        alt={`${attendee.name} (avatar)`} 
        src={attendee.photoThumbnailUrl}
      />
    ));

    if (attendeeCount > attendeesToPreview.length) {
      thumbnails.push(
        <div key="placeholder" className="UserListPreview-placeholder">
          + {attendeeCount - attendeesToPreview.length}
        </div>
      );
    }

    return thumbnails;
  },

  render: function() {
    return (
      <div className="UserListPreview">
        {this.props.attendeesToPreview.length > 0 
          ? this.renderThumbnails() 
          : this.renderThumbnailsEmpty()}
      </div>
    );
  }

});

module.exports = UserListPreview;