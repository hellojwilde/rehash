var React = require('react');
var OverviewDescription = require('components/meeting/overview/OverviewDescription');
var OverviewAttendees = require('components/meeting/overview/OverviewAttendees');
var OverviewSpeaker = require('components/meeting/overview/OverviewSpeaker');
var OverviewHighlights = require('components/meeting/overview/OverviewHighlights');

var joinClasses = require('react/lib/joinClasses');

var MeetingOverview = React.createClass({

  propTypes: {
    id: React.PropTypes.number,
    speaker: React.PropTypes.object,
    description: React.PropTypes.string,
    highlights: React.PropTypes.array,
    attendees: React.PropTypes.array
  },

  render: function() {
    var {className} = this.props;

    return (
      <div className={joinClasses('container MeetingOverview', className)}>
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