var React = require('react');
var LinkNoClobber = require('components/common/LinkNoClobber');
var ScheduleLabel = require('components/common/ScheduleLabel');

var meetingStatusPropType = require('types/meetingStatusPropType');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./Tile.css');

var Tile = React.createClass({

  propTypes: {
    meetingId: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired,
    start: React.PropTypes.object.isRequired,
    status: meetingStatusPropType.isRequired,
    description: React.PropTypes.string,
    backgroundImageUrl: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      description: '',
      backgroundImageUrl: require('./cartographer/cartographer.png')
    };
  },

  render: function() {
    var {
      meetingId, 
      title, 
      description, 
      start, 
      status,
      backgroundImageUrl
    } = this.props;

    return (
      <LinkNoClobber to="explore_meeting" params={{meetingId: meetingId}}>
        <div 
          className='Tile' 
          style={{backgroundImage: `url(${backgroundImageUrl})`}}>
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