var React = require('react');
var LinkNoClobber = require('components/explore/LinkNoClobber');

var cx = require('classnames');
var joinClasses = require('react/lib/joinClasses');
var moment = require('moment');

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

  renderSchedule: function() {
    var classNames = {'Tile-schedule': true};
    var label = moment(this.props.start).format();

    if (this.props.isBroadcasting) {
      classNames['Tile-schedule--isBroadcasting'] = true;
      label = 'Live';
    }

    if (moment().isAfter(this.props.start)) {
      classNames['Tile-subscribe--isAfterStart'] = true;
      label = 'Scheduled';
    }

    return (
      <div className={cx(classNames)}>
        {label}
      </div>
    );
  },

  render: function() {
    var {id, title, description, backgroundImageUrl} = this.props;

    return (
      <LinkNoClobber to="explore_meeting" params={{meetingId: id}}>
        <div className='Tile' style={{backgroundImage: `url(${backgroundImageUrl})`}}>
          {this.renderSchedule()}

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