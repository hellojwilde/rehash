var React = require('react');

var MeetingLayout = require('components/meeting/MeetingLayout');
var MeetingLayoutAside = require('components/meeting/MeetingLayoutAside');
var MeetingLayoutContent = require('components/meeting/MeetingLayoutContent');
var MeetingNavigationLink = require('components/meeting/MeetingNavigationLink');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./MeetingNavigation.css');

var MeetingNavigation = React.createClass({

  propTypes: {
    meetingId: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <div className="MeetingNavigation">
        <MeetingLayout className="MeetingNavigation-inner">
          <MeetingLayoutAside className="col-sm-5 col-md-4">
            <ul className="nav nav-pills">
              <MeetingNavigationLink 
                to="meeting-overview" 
                meetingId={this.props.meetingId}>
                Overview
              </MeetingNavigationLink>
              <MeetingNavigationLink 
                to="meeting-broadcast"
                meetingId={this.props.meetingId}>
                Broadcast
              </MeetingNavigationLink>
            </ul>
          </MeetingLayoutAside>

          <MeetingLayoutContent>
            <h3 className="MeetingNavigation-title">{this.props.title}</h3>
          </MeetingLayoutContent>
        </MeetingLayout>
      </div>
    );
  }

});

module.exports = MeetingNavigation;