var React = require('react');
var DocumentTitle = require('react-document-title');
var Meeting = require('components/meeting/Meeting')
var FluxComponent = require('flummox/component');

var MeetingHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state, registry) {
      var {meetingKey} = state.params;
      return registry.getActions('meeting').fetch(meetingKey);
    },

    willTransitionFrom: function(transition, element) {
      element && element.context && (element.context.flux.getActions('webRTC')
        .disconnect());
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