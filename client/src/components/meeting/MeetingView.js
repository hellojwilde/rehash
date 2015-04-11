var MeetingBeforeView = require('components/meeting/MeetingBeforeView');
var MeetingDuringView = require('components/meeting/MeetingDuringView');
var React = require('react');

var meetingPropType = require('types/meetingPropType');

var MeetingView = React.createClass({

  propTypes: {
    meeting: meetingPropType.isRequired
  },

  getInitialState: function() {
    var {isBroadcasting} = this.props.meeting;
    
    return {
      view: isBroadcasting ? MeetingDuringView : MeetingBeforeView
    };
  },

  handleRequestViewChange: function(newView) {
    this.setState({view: newView});
  },

  render: function() {
    var View = this.state.view;

    return (
      <View {...this.props}/>
    );
  }

});

module.exports = MeetingView;