var BeforeMeeting = require('components/meeting/BeforeMeeting');
var DuringMeeting = require('components/meeting/DuringMeeting');
var AfterMeeting = require('components/meeting/AfterMeeting');
var React = require('react');

var meetingPropType = require('types/meetingPropType');

var Meeting = React.createClass({

  propTypes: {
    meeting: meetingPropType.isRequired,
  },

  getInitialState: function() {
    return {
      view: this.getInitialMeetingView()
    };
  },

  getInitialMeetingView: function() {
    switch (this.props.meeting.status) {
      case 'scheduled':
        return BeforeMeeting;
      case 'broadcasting':
        return DuringMeeting;
      case 'ended':
        return AfterMeeting;
    }
  }

  handleRequestViewChange: function(newView) {
    this.setState({view: newView});
  },

  render: function() {
    var View = this.state.view;
    
    return (
      <View 
        {...this.props} 
        onRequestViewChange={this.handleRequestViewChange}
      />
    );
  }

});

module.exports = Meeting;