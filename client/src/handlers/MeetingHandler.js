var React = require('react');
var DocumentTitle = require('react-document-title');
var Meeting = require('components/meeting/Meeting')
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
        connectToStores={['meeting', 'currentUser']}
        stateGetter={([meetingStore, currentUserStore]) => ({
          meeting: meetingStore.getById(meetingId),
          isAttendee: currentUserStore.isAttendee(meetingId),
          isHost: currentUserStore.isHost(meetingId)
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