var DocumentTitle = require('react-document-title');
var FluxComponent = require('flummox/component');
var Meeting = require('components/meeting/Meeting')
var React = require('react');

var MeetingHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state, registry) {
      var {meetingKey} = state.params;
      var meetingActions = registry.getActions('meeting');

      return Promise.all(
        meetingActions.fetch(meetingKey), 
        meetingActions.open(meetingKey)
      );
    },

    willTransitionFrom: function(transition, element) {
      if (
        element && 
        element.context && 
        element.context.flux &&
        element.context.router
      ) {
        var {meetingKey} = element.context.router.getCurrentParams();
        var webRTCActions = element.context.flux.getActions('webRTC');
        var meetingActions = element.context.flux.getActions('meeting');

        meetingActions.close(meetingKey);
        webRTCActions.disconnect();
      }
    }
  },

  contextTypes: {
    router: React.PropTypes.func.isRequired,
    flux: React.PropTypes.object.isRequired
  },

  render: function() {
    var {meetingKey} = this.context.router.getCurrentParams();

    return (
      <FluxComponent
        key={meetingKey}
        connectToStores={['meeting', 'webRTC']}
        stateGetter={([meetingStore, webRTCStore]) => ({
          meeting: meetingStore.getByKey(meetingKey),
          meetingRelation: meetingStore.getCurrentUserRelationByKey(meetingKey),
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