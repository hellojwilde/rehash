var Agenda = require('components/meeting/agenda/Agenda');
var Broadcast = require('components/meeting/broadcast/Broadcast');
var MeetingLayout = require('components/meeting/MeetingLayout');
var MeetingLayoutAside = require('components/meeting/MeetingLayoutAside');
var MeetingLayoutContent = require('components/meeting/MeetingLayoutContent');
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
          <Broadcast/>
        </MeetingLayoutAside>

        <MeetingLayoutContent>
          <Agenda meetingId={this.props.meetingId} topics={this.props.topics}/>
        </MeetingLayoutContent>
      </MeetingLayout>
    );
  }

});

module.exports = MeetingBroadcastView;