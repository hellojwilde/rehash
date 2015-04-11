var React = require('react');
var MeetingView = require('components/meeting/MeetingView')
var FluxComponent = require('flummox/component');

var MeetingHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state, registry) {
      var {meetingId} = state.params;
      return registry.getActions('meeting').fetch(+meetingId)
    }
  },

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render: function() {
    var {meetingId} = this.context.router.getCurrentParams();

    return (
      <FluxComponent 
        connectToStores={['meeting']}
        stateGetter={([meetingStore]) => ({
          meeting: meetingStore.getById(meetingId)
        })}
        render={(state) => <MeetingView {...state} />}
      />
    );
  }

});

module.exports = MeetingHandler;