var FluxComponent = require('flummox/component');
var FluxRegistry = require('FluxRegistry');
var MeetingBroadcastView = require('components/meeting/MeetingBroadcastView');
var React = require('react');

var getMeetingWillTransitionTo = require('helpers/getMeetingWillTransitionTo');

var MeetingBroadcastHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state) {
      var {meetingId} = state.params;
      var meetingActions = FluxRegistry.getActions('agenda');

      return meetingActions.fetch(meetingId);
    },
    
    willTransitionTo: getMeetingWillTransitionTo('meeting-broadcast')
  },
 
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
      <FluxComponent 
        connectToStores={['agenda']}
        stateGetter={(agendaStore) => {
          var {meetingId} = this.context.router.getCurrentParams();
          return {
            meetingId: meetingId,
            agenda: store.getByMeetingId(meetingId)
          };
        }}
        render={(state) => <MeetingBroadcastView {...state}/>}
      />
    );
  }

});

module.exports = MeetingBroadcastHandler;