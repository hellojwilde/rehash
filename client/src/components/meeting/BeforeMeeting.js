var AgendaList = require('components/meeting/agenda/AgendaList');
var AttendeeBlock = require('components/meeting/attendee/AttendeeBlock');
var EditMeetingModal = require('modals/EditMeetingModal');
var IconButton = require('components/common/IconButton');
var React = require('react');
var ScheduleLabel = require('components/common/ScheduleLabel');

var meetingPropType = require('types/meetingPropType');
var meetingRelationPropType = require('types/meetingRelationPropType');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./BeforeMeeting.css');

var BeforeMeeting = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    meeting: meetingPropType.isRequired,
    meetingRelation: meetingRelationPropType.isRequired
  },

  handleEditClick: function() {
    var modalActions = this.context.flux.getActions('modal');
    
    modalActions.push(EditMeetingModal, {
      meetingKey: this.props.meeting.key
    });
  },

  render: function() {
    var {meeting, meetingRelation} = this.props;

    return (
      <div className="BeforeMeeting">
        <div className="BeforeMeeting-layout">
          <div className="container">
            <div className="row">
              <div className="col-sm-6 col-md-8 BeforeMeeting-agenda">
                <AgendaList isHost={meetingRelation.isHost} />
              </div>
              <div className="col-sm-6 col-md-4 BeforeMeeting-description">
                <div className="BeforeMeeting-description-header">
                  <button 
                    onClick={this.handleEditClick} 
                    className="btn btn-default btn-sm">
                    Edit
                  </button>
                </div>
                <div className="BeforeMeeting-description-content">
                  <div>
                    <ScheduleLabel 
                      start={meeting.start} 
                      isBroadcasting={meeting.isBroadcasting}
                    />

                    <h2>{meeting.title}</h2>
                    <p>{meeting.description}</p>

                    <AttendeeBlock 
                      meetingKey={meeting.key}
                      meetingRelation={meetingRelation}
                      attendees={meeting.attendees}
                    />
                  </div>
                </div>
                <div className="BeforeMeeting-description-footer">
                  <IconButton
                    className="btn-lg btn-block btn-primary BeforeMeeting-broadcast-button"
                    icon="facetime-video">
                    Broadcast
                  </IconButton>
                  <small className="text-muted">
                    We'll let you check your video before you go live. 
                  </small>
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