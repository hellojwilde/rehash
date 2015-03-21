var React = require('react');

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