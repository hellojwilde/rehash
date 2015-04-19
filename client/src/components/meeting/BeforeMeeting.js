var AgendaList = require('components/meeting/agenda/AgendaList');
var DuringMeeting = require('components/meeting/DuringMeeting');
var EditMeetingModal = require('modals/EditMeetingModal');
var React = require('react');
var ScheduleLabel = require('components/common/ScheduleLabel');
var HostActionBlock = require('components/meeting/action/HostActionBlock');
var NonHostActionBlock = require('components/meeting/action/NonHostActionBlock');

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
    meetingRelation: meetingRelationPropType.isRequired,
    webRTC: React.PropTypes.object.isRequired,
    onRequestViewChange: React.PropTypes.func.isRequired
  },

  handleEditClick: function() {
    var modalActions = this.context.flux.getActions('modal');
    
    modalActions.push(EditMeetingModal, {
      meetingKey: this.props.meeting.key
    });
  },

  handleBroadcastStartOrJoin: function() {
    this.props.onRequestViewChange(DuringMeeting);
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
                {meetingRelation.isHost && (
                  <div className="BeforeMeeting-description-header">
                    <button 
                      onClick={this.handleEditClick} 
                      className="btn btn-default btn-sm">
                      Edit
                    </button>
                  </div>
                )}
                <div className="BeforeMeeting-description-content">
                  <div>
                    <ScheduleLabel 
                      start={meeting.start} 
                      isBroadcasting={meeting.isBroadcasting}
                    />

                    <h2 className="BeforeMeeting-description-title">{meeting.title}</h2>
                    <p>{meeting.description}</p>
                  </div>
                </div>
                <div className="BeforeMeeting-description-footer">
                  {meetingRelation.isHost 
                    ? <HostActionBlock 
                        {...this.props} 
                        onBroadcastStart={this.handleBroadcastStartOrJoin}
                      />
                    : <NonHostActionBlock
                        {...this.props}
                        onBroadcastJoin={this.handleBroadcastStartOrJoin}
                      />}
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