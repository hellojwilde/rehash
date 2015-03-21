var React = require('react');
var OverviewDescription = require('components/meeting/overview/OverviewDescription');
var OverviewAttendees = require('components/meeting/overview/OverviewAttendees');
var OverviewSpeaker = require('components/meeting/overview/OverviewSpeaker');
var OverviewHighlights = require('components/meeting/overview/OverviewHighlights');

require('./MeetingOverview.css');

var MeetingOverview = React.createClass({

  propTypes: {
    speaker: React.PropTypes.object.isRequired,
    description: React.PropTypes.string.isRequired,
    highlights: React.PropTypes.array.isRequired,
    attendees: React.PropTypes.array.isRequired
  },

  render: function() {
    return (
      <div className="container MeetingOverview">
        <div className="row">
          <div className="col-sm-5 col-md-4">
            <OverviewSpeaker {...this.props.speaker} />
          </div>

          <div className="col-sm-7 col-md-8">
            <OverviewDescription description={this.props.description} />
            <OverviewHighlights highlights={this.props.highlights} />
            <OverviewAttendees attendees={this.props.attendees} />
          </div>
        </div>
      </div>
    );
  }

});

module.exports = MeetingOverview;