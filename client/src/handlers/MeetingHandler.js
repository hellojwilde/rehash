var DocumentTitle = require('react-document-title');
var FluxComponent = require('flummox/component');
var Meeting = require('components/meeting/Meeting')
var React = require('react');

var MeetingHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state, registry) {
      var {meetingId} = state.params;
      var meetingActions = registry.getActions('meeting');
      return meetingActions.open(meetingId);
    },

    willTransitionFrom: function(transition, element) {
      if (
        element && 
        element.context && 
        element.context.flux &&
        element.context.router
      ) {
        var {meetingId} = element.context.router.getCurrentParams();
        var meetingActions = element.context.flux.getActions('meeting');
        meetingActions.close(meetingId);
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
        connectToStores={['meeting', 'webRTC', 'topic']}
        stateGetter={([meetingStore, webRTCStore, topicStore]) => ({
          meeting: meetingStore.getById(meetingId),
          meetingRelation: meetingStore.getCurrentUserRelationById(meetingId),
          topics: topicStore.getByMeetingId(meetingId),
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