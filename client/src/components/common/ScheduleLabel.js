var React = require('react');

var cx = require('classnames');
var joinClasses = require('react/lib/joinClasses');
var moment = require('moment');

var ScheduleLabel = React.createClass({

  propTypes: {
    start: React.PropTypes.object.isRequired,
    isBroadcasting: React.PropTypes.bool.isRequired
  },

  render: function() {
    var {className, start, isBroadcasting, ...otherProps} = this.props;
    var classNames = {'ScheduleLabel': true};
    var label = moment(start).fromNow();

    if (isBroadcasting) {
      classNames['ScheduleLabel--isBroadcasting'] = true;
      label = 'Live';
    }

    if (moment().isAfter(start)) {
      classNames['ScheduleLabel--isAfterStart'] = true;
      label = `Scheduled for ${label}`;
    }

    return (
      <div {...otherProps} className={joinClasses(className, cx(classNames))}>
        {label}
      </div>
    );
  }

});

module.exports = ScheduleLabel;