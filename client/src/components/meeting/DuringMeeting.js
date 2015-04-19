var React = require('react');
var Broadcast = require('components/meeting/broadcast/Broadcast');

var meetingPropType = require('types/meetingPropType');
var meetingRelationPropType = require('types/meetingRelationPropType');

require('./DuringMeeting.css');

var DuringMeeting = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    meeting: meetingPropType.isRequired,
    meetingRelation: meetingRelationPropType.isRequired,
    webRTC: React.PropTypes.object.isRequired,
    onRequestViewChange: React.PropTypes.func.isRequired
  },

  render: function() {
    var {meeting, ...otherProps} = this.props;

    return (
      <div className="DuringMeeting">
        <Broadcast {...otherProps} className="DuringMeeting-video" />

        <div className="DuringMeeting-overlay">
          <div className="container">
            <h2>
              {meeting.host.name}
              <span className="label label-default">Host</span>
            </h2>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = DuringMeeting;