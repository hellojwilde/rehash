var React = require('react');
var LinkNoClobber = require('components/explore/LinkNoClobber');
var MeetingScheduleLabel = require('components/meeting/MeetingScheduleLabel');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./Tile.css');

var Tile = React.createClass({

  propTypes: {
    id: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired,
    start: React.PropTypes.object.isRequired,
    isBroadcasting: React.PropTypes.bool,
    description: React.PropTypes.string,
    backgroundImageUrl: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      isBroadcasting: false,
      description: '',
      backgroundImageUrl: require('./cartographer/cartographer.png')
    };
  },

  render: function() {
    var {
      id, 
      title, 
      description, 
      start, 
      backgroundImageUrl, 
      isBroadcasting
    } = this.props;

    return (
      <LinkNoClobber to="explore_meeting" params={{meetingId: id}}>
        <div 
          className='Tile' 
          style={{backgroundImage: `url(${backgroundImageUrl})`}}>
          <MeetingScheduleLabel 
            className="Tile-schedule"
            isBroadcasting={isBroadcasting}
            start={start}
          />

          <div className="Tile-main">
            <h3 className="Tile-main-tile">{title}</h3>
            <p className="Tile-main-description">{description}</p>
          </div>
        </div>
      </LinkNoClobber>
    );
  }

});

module.exports = Tile;