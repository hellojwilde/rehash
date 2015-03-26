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
    var {meetingId} = this.context.router.getCurrentParams();

    return (
      <FluxComponent 
        connectToStores={{agenda: (store) => store.getByMeetingId(meetingId)}}>
        <MeetingBroadcastView meetingId={meetingId}/>
      </FluxComponent>
    );
  }

});

module.exports = MeetingBroadcastHandler;