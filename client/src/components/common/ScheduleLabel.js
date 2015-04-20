var React = require('react');

var cx = require('classnames');
var joinClasses = require('react/lib/joinClasses');
var moment = require('moment');
var meetingStatusPropType = require('types/meetingStatusPropType');

require('./ScheduleLabel.css');

var ScheduleLabel = React.createClass({

  propTypes: {
    start: React.PropTypes.object.isRequired,
    status: meetingStatusPropType.isRequired
  },

  render: function() {
    var {className, start, status, ...otherProps} = this.props;
    var classNames = {'ScheduleLabel': true};
    var label = moment(start).fromNow();

    if (status === 'scheduled' && moment().isAfter(start)) {
      classNames['ScheduleLabel--isAfterStart'] = true;
      label = `Scheduled for ${label}`;
    } else if (status === 'broadcasting') {
      classNames['ScheduleLabel--isBroadcasting'] = true;
      label = 'Live Now';
    } else if (status === 'ended') {
      classNames['ScheduleLabel--isEnded'] = true;
      label = 'Ended';
    }

    return (
      <div 
        {...otherProps}
        className={joinClasses(className, cx(classNames))}>
        {label}
      </div>
    );
  }

});

module.exports = ScheduleLabel;