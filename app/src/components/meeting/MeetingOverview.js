var React = require('react');
var MeetingHeader = require('components/meeting/MeetingHeader');
var OverviewDescription = require('components/meeting/overview/OverviewDescription');
var OverviewAttendees = require('components/meeting/overview/OverviewAttendees');
var OverviewSpeaker = require('components/meeting/overview/OverviewSpeaker');
var OverviewHighlights = require('components/meeting/overview/OverviewHighlights');

require('components/meeting/MeetingOverview.css');

var MeetingOverview = React.createClass({

  propTypes: {
    meeting: React.PropTypes.object.isRequired,
    isJoined: React.PropTypes.bool.isRequired
  },

  render: function() {
    console.log(this.props)

    var {speaker, description, highlights, attendees} = this.props.meeting;

    return (
      <div className="MeetingOverview">
        <MeetingHeader 
          {...this.props.meeting}
          isJoined={this.props.isJoined}
        />

        <div className="container MeetingOverview-content">
          <div className="row">
            <div className="col-sm-5 col-md-4">
              <OverviewSpeaker {...speaker} />
            </div>

            <div className="col-sm-7 col-md-8">
              <OverviewDescription description={description} />
              <OverviewHighlights highlights={highlights} />
              <OverviewAttendees attendees={attendees} />
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = MeetingOverview;