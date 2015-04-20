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
      view: this.getMeetingView(this.props.meeting.status)
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.meeting.status !== 'broadcasting') {
      this.setState({
        view: this.getMeetingView(nextProps.meeting.status)
      });
    }
  },

  getMeetingView: function(status) {
    switch (status) {
      case 'scheduled':
        return BeforeMeeting;
      case 'broadcasting':
        return DuringMeeting;
      case 'ended':
        return AfterMeeting;
    }
  },

  handleRequestViewChange: function(view) {
    this.setState({view});
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