var React = require('react');
var MeetingScheduleLabel = require('./MeetingScheduleLabel');

var meetingPropType = require('types/meetingPropType');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./MeetingBeforeView.css');

var MeetingBeforeView = React.createClass({

  propTypes: {
    meeting: meetingPropType.isRequired
  },

  render: function() {
    var {meeting} = this.props;

    return (
      <div className="MeetingBeforeView">
        <div className="MeetingBeforeView-layout">
          <div className="container">
            <div className="row">
              <div className="col-xs-8">
                Agenda goes here
              </div>
              <div className="col-xs-4 MeetingBeforeView-description">
                <div>
                  <MeetingScheduleLabel 
                    start={meeting.start} 
                    isBroadcasting={meeting.isBroadcasting}
                  />

                  <h2>{meeting.title}</h2>
                  <p>{meeting.description}</p>

                  List of attendees and/or picture of broadcast goes here
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = MeetingBeforeView;