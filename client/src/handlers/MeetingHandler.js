var DocumentTitle = require('react-document-title');
var FluxComponent = require('flummox/component');
var Meeting = require('components/meeting/Meeting')
var React = require('react');

var MeetingHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state, registry) {
      var {meetingId} = state.params;
      var meetingActions = registry.getActions('meeting');
      var meetingStore = registry.getStore('meeting');
      var webRTCActions = registry.getActions('webRTC');

      return Promise.all([
        meetingActions.fetch(meetingId), 
        meetingActions.open(meetingId)
      ]).then(() => {
        var meeting = meetingStore.getById(meetingId);
        var relation = meetingStore.getCurrentUserRelationById(meetingId);

        if (meeting.status === 'broadcasting') {
          if (relation.isHost) {
            webRTCActions.prepareAsHost(meetingId)
              .then(() => webRTCActions.connectAsHost(meetingId))
          } else {
            webRTCActions.connectAsAttendee(meetingId);
          }
        }
      });
    },

    willTransitionFrom: function(transition, element) {
      if (
        element && 
        element.context && 
        element.context.flux &&
        element.context.router
      ) {
        var {meetingId} = element.context.router.getCurrentParams();
        var webRTCActions = element.context.flux.getActions('webRTC');
        var meetingActions = element.context.flux.getActions('meeting');

        meetingActions.close(meetingId);
        meetingActions.broadcastEnd(meetingId);
        webRTCActions.disconnect();
      }
    }
  },

  contextTypes: {
    router: React.PropTypes.func.isRequired,
    flux: React.PropTypes.object.isRequired
  },

  render: function() {
    var {meetingId} = this.context.router.getCurrentParams();

    return (
      <FluxComponent
        key={meetingId}
        connectToStores={['meeting', 'webRTC']}
        stateGetter={([meetingStore, webRTCStore]) => ({
          meeting: meetingStore.getById(meetingId),
          meetingRelation: meetingStore.getCurrentUserRelationById(meetingId),
          webRTC: webRTCStore.state
        })}
        render={(state) => (
          <DocumentTitle title={`${state.meeting.title} - Rehash`}>
            <Meeting {...state} />
          </DocumentTitle>
        )}
      />
    );
  }

});

module.exports = MeetingHandler;