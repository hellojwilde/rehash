var React = require('react');
var MeetingBroadcastView = require('components/meeting/MeetingBroadcastView');

var MeetingBroadcastHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state, flux) {
      var {meetingId} = state.params,
          meetingActions = flux.getActions('agenda');

      return meetingActions.fetch(meetingId);
    }
  },

  render: function() {
    return (
      <div />
    );
  }

});

module.exports = MeetingBroadcastHandler;