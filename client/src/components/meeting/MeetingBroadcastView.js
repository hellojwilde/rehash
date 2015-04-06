var Agenda = require('components/meeting/broadcast/BroadcastAgenda');
var Broadcast = require('components/meeting/broadcast/Broadcast');
var MeetingLayout = require('components/meeting/common/MeetingLayout');
var MeetingLayoutAside = require('components/meeting/common/MeetingLayoutAside');
var MeetingLayoutContent = require('components/meeting/common/MeetingLayoutContent');
var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var MeetingBroadcastView = React.createClass({

  propTypes: {
    meetingId: React.PropTypes.number.isRequired,
    topics: React.PropTypes.array.isRequired
  },

  render: function() {
    return (
      <MeetingLayout>
        <MeetingLayoutAside>
          <Broadcast meetingId={this.props.meetingId} />
        </MeetingLayoutAside>

        <MeetingLayoutContent>
          <Agenda meetingId={this.props.meetingId} topics={this.props.topics}/>
        </MeetingLayoutContent>
      </MeetingLayout>
    );
  }

});

module.exports = MeetingBroadcastView;