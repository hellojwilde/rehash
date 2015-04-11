var React = require('react');
var {Link} = require('react-router');

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
    onSubscribe: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      isBroadcasting: false,
      description: '',
      backgroundImageUrl: ''
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
    return (
      <Link to="explore_meeting" meetingId={this.props.id}>
        <div className='Tile'>
          {this.renderSchedule()}

          <div className="Tile-main">
            <h3>{this.props.title}</h3>
            <p>{this.props.description}</p>
          </div>
        </div>
      </Link>
    );
  }

});

module.exports = Tile;