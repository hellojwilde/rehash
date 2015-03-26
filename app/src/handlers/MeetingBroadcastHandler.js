var FluxComponent = require('flummox/component');
var FluxRegistry = require('FluxRegistry');
var MeetingBroadcastView = require('components/meeting/MeetingBroadcastView');
var MeetingNavigation = require('components/meeting/MeetingNavigation');
var React = require('react');

var MeetingBroadcastHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state) {
      var {meetingId} = state.params,
          meetingActions = FluxRegistry.getActions('agenda');

      return meetingActions.fetch(meetingId);
    },

    willTransitionTo: function(transition, params, query) {
      var {meetingId} = params,
          currentUserStore = FluxRegistry.getStore('currentUser');

      if (!currentUserStore.isJoined(meetingId)) {
        transition.redirect('meeting-overview', params, query);
      }
    }
  },
 
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render: function() {
    var {meetingId} = this.context.router.getCurrentParams();

    return (
      <FluxComponent 
        connectToStores={{agenda: (store) => store.getByMeetingId(meetingId)}}>
        <MeetingNavigation meetingId={meetingId} title={'Broadcast'}/>
        <MeetingBroadcastView meetingId={meetingId}/>
      </FluxComponent>
    );
  }

});

module.exports = MeetingBroadcastHandler;