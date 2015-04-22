var React = require('react');
var LinkNoClobber = require('components/common/LinkNoClobber');
var ScheduleLabel = require('components/common/ScheduleLabel');

var meetingStatusPropType = require('types/meetingStatusPropType');
var joinClasses = require('react/lib/joinClasses');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./Tile.css');

const DEFAULT_PICTURE_URL = require('./cartographer/cartographer.png');

var Tile = React.createClass({

  propTypes: {
    meetingId: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired,
    start: React.PropTypes.object.isRequired,
    status: meetingStatusPropType.isRequired,
    description: React.PropTypes.string,
    broadcastPictureUrl: React.PropTypes.string,
    pictureUrl: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      description: ''
    };
  },

  getBackgroundImage: function() {
    return (
      this.props.broadcastPictureUrl ||
      this.props.pictureUrl ||
      DEFAULT_PICTURE_URL
    );
  },

  getHasProvidedBackgroundImage: function() {
    return !!(this.props.broadcastPictureUrl || this.props.pictureUrl);
  },

  render: function() {
    var {
      meetingId, 
      title, 
      description, 
      start, 
      status
    } = this.props;

    return (
      <LinkNoClobber to="explore_meeting" params={{meetingId: meetingId}}>
        <div 
          className={joinClasses(
            'Tile', 
            this.getHasProvidedBackgroundImage() && 'Tile--hasPicture'
          )} 
          style={{backgroundImage: `url(${this.getBackgroundImage()})`}}>
          <ScheduleLabel className="Tile-schedule" {...{start, status}}/>
          <div className="Tile-main">
            <h3 className="Tile-main-title">{title}</h3>
            <p className="Tile-main-description">{description}</p>
          </div>
        </div>
      </LinkNoClobber>
    );
  }

});

module.exports = Tile;