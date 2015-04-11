var React = require('react');

var MeetingHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state, registry) {
      var {meetingId} = state.params;
      return registry.getActions('meeting').fetch(+meetingId)
    }
  },

  render: function() {
    return (
      <div>Meetinggggg</div>
    );
  }

});

module.exports = MeetingHandler;