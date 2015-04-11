var React = require('react');

var cx = require('classnames');
var joinClasses = require('react/lib/joinClasses');
var moment = require('moment');

var MeetingScheduleLabel = React.createClass({

  propTypes: {
    start: React.PropTypes.object.isRequired,
    isBroadcasting: React.PropTypes.bool.isRequired
  },

  render: function() {
    var {className, start, isBroadcasting, ...otherProps} = this.props;
    var classNames = {'MeetingScheduleLabel': true};
    var label = moment(start).format();

    if (isBroadcasting) {
      classNames['MeetingScheduleLabel--isBroadcasting'] = true;
      label = 'Live';
    }

    if (moment().isAfter(start)) {
      classNames['MeetingScheduleLabel--isAfterStart'] = true;
      label = 'Scheduled';
    }

    return (
      <div {...otherProps} className={joinClasses(className, cx(classNames))}>
        {label}
      </div>
    );
  }

});

module.exports = MeetingScheduleLabel;