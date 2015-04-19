var AttendeePreview = require('components/meeting/attendee/AttendeePreview');
var SubscribeButton = require('components/meeting/attendee/SubscribeButton');
var React = require('react');

var _ = require('lodash');
var meetingRelationPropType = require('types/meetingRelationPropType');
var userPropType = require('types/userPropType');

var AttendeeBlock = React.createClass({

  propTypes: {
    meetingKey: React.PropTypes.string.isRequired,
    meetingRelation: meetingRelationPropType.isRequired,
    attendees: React.PropTypes.arrayOf(userPropType)
  },

  getDefaultProps: function() {
    return {
      attendees: []
    };
  },

  render: function() {
    var {meetingKey, attendees, meetingRelation} = this.props;

    return (
      <div className="AttendeeBlock">
        <AttendeePreview
          previewed={_.take(attendees, 5)}
          totalNumber={attendees.length}
        />
        {!meetingRelation.isHost && (
          <SubscribeButton
            meetingKey={meetingKey}
            isAttendee={meetingRelation.isAttendee}
          />
        )}
      </div>
    );
  }

});

module.exports = AttendeeBlock;