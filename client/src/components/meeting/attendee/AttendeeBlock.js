var AttendeePreview = require('components/meeting/attendee/AttendeePreview');
var SubscribeButton = require('components/meeting/attendee/SubscribeButton');
var React = require('react');

var _ = require('lodash');
var meetingPropType = require('types/meetingPropType');

var AttendeeBlock = React.createClass({

  propTypes: {
    meeting: meetingPropType.isRequired,
    isHost: React.PropTypes.bool.isRequired,
    isAttendee: React.PropTypes.bool.isRequired
  },

  render: function() {
    var {meeting, isHost, isAttendee} = this.props;
    var attendees = [meeting.host].concat(meeting.attendees);

    return (
      <div className="AttendeeBlock">
        <AttendeePreview
          previewed={_.take(attendees, 5)}
          totalNumber={attendees.length}
        />
        <SubscribeButton
          meetingKey={meeting.key}
          isHost={isHost}
          isAttendee={isAttendee}
        />
      </div>
    );
  }

});

module.exports = AttendeeBlock;