var BeforeMeeting = require('components/meeting/BeforeMeeting');
var DuringMeeting = require('components/meeting/DuringMeeting');
var React = require('react');

var meetingPropType = require('types/meetingPropType');

var Meeting = React.createClass({

  propTypes: {
    meeting: meetingPropType.isRequired
  },

  getInitialState: function() {
    return {
      view: this.props.meeting.isBroadcasting ? DuringMeeting : BeforeMeeting
    };
  },

  handleRequestViewChange: function(newView) {
    this.setState({view: newView});
  },

  render: function() {
    var View = this.state.view;
    return <View {...this.props} />;
  }

});

module.exports = Meeting;