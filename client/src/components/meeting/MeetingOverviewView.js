var React = require('react');
var MeetingLayout = require('components/meeting/MeetingLayout');
var MeetingLayoutAside = require('components/meeting/MeetingLayoutAside');
var MeetingLayoutContent = require('components/meeting/MeetingLayoutContent');
var OverviewDescription = require('components/meeting/overview/OverviewDescription');
var OverviewAttendees = require('components/meeting/overview/OverviewAttendees');
var OverviewHost = require('components/meeting/overview/OverviewHost');
var OverviewHighlights = require('components/meeting/overview/OverviewHighlights');

var MeetingOverviewView = React.createClass({

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
          <OverviewHost {...this.props.host} />
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