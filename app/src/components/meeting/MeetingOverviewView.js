var React = require('react');
var MeetingLayout = require('components/meeting/MeetingLayout');
var MeetingLayoutAside = require('components/meeting/MeetingLayoutAside');
var MeetingLayoutContent = require('components/meeting/MeetingLayoutContent');
var OverviewDescription = require('components/meeting/overview/OverviewDescription');
var OverviewAttendees = require('components/meeting/overview/OverviewAttendees');
var OverviewSpeaker = require('components/meeting/overview/OverviewSpeaker');
var OverviewHighlights = require('components/meeting/overview/OverviewHighlights');

var MeetingOverviewView = React.createClass({

  propTypes: {
    speaker: React.PropTypes.object.isRequired,
    description: React.PropTypes.string.isRequired,
    highlights: React.PropTypes.array.isRequired,
    attendees: React.PropTypes.array.isRequired
  },

  render: function() {
    return (
      <MeetingLayout>
        <MeetingLayoutAside>
          <OverviewSpeaker {...this.props.speaker} />
        </MeetingLayoutAside>

        <MeetingLayoutContent>
          <OverviewDescription description={this.props.description} />
          <OverviewHighlights highlights={this.props.highlights} />
          <OverviewAttendees attendees={this.props.attendees} />
        </MeetingLayoutContent>
      </MeetingLayout>
    );
  }

});

module.exports = MeetingOverviewView;