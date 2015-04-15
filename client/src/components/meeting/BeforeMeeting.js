var AgendaList = require('components/meeting/agenda/AgendaList');
var AttendeeBlock = require('components/meeting/attendee/AttendeeBlock');
var React = require('react');
var ScheduleLabel = require('components/common/ScheduleLabel');

var meetingPropType = require('types/meetingPropType');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./BeforeMeeting.css');

var BeforeMeeting = React.createClass({

  propTypes: {
    isHost: React.PropTypes.bool.isRequired,
    isAttendee: React.PropTypes.bool.isRequired,
    meeting: meetingPropType.isRequired
  },

  render: function() {
    var {meeting, isHost} = this.props;

    return (
      <div className="BeforeMeeting">
        <div className="BeforeMeeting-layout">
          <div className="container">
            <div className="row">
              <div className="col-sm-6 col-md-8 BeforeMeeting-agenda">
                <AgendaList isHost={isHost} />
              </div>
              <div className="col-sm-6 col-md-4 BeforeMeeting-description">
                <div>
                  <ScheduleLabel 
                    start={meeting.start} 
                    isBroadcasting={meeting.isBroadcasting}
                  />

                  <div className="BeforeMeeting-description-core">
                    <h2>{meeting.title}</h2>
                    <p>{meeting.description}</p>
                  </div>

                  <AttendeeBlock {...this.props}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = BeforeMeeting;