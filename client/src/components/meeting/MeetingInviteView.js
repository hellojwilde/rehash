var React = require('react');
var MeetingLayout = require('components/meeting/MeetingLayout');
var MeetingLayoutAside = require('components/meeting/MeetingLayoutAside');
var MeetingLayoutContent = require('components/meeting/MeetingLayoutContent');
var InviteDescription = require('components/meeting/invite/InviteDescription');
var InviteAttendees = require('components/meeting/invite/InviteAttendees');
var InviteHost = require('components/meeting/invite/InviteHost');
var InviteHighlights = require('components/meeting/invite/InviteHighlights');

var MeetingInviteView = React.createClass({

  propTypes: {
    host: React.PropTypes.object.isRequired,
    description: React.PropTypes.string.isRequired,
    highlights: React.PropTypes.array.isRequired,
    attendees: React.PropTypes.array.isRequired
  },

  render: function() {
    return (
      <MeetingLayout>
        <MeetingLayoutAside>
          <InviteHost {...this.props.host} />
        </MeetingLayoutAside>

        <MeetingLayoutContent>
          <InviteDescription description={this.props.description} />
          <InviteHighlights highlights={this.props.highlights} />
          <InviteAttendees attendees={this.props.attendees} />
        </MeetingLayoutContent>
      </MeetingLayout>
    );
  }

});

module.exports = MeetingInviteView;