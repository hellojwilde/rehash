var DocumentTitle = require('react-document-title');
var FluxComponent = require('flummox/component');
var MeetingOverview = require('components/meeting/MeetingOverview');
var React = require('react');

var MeetingHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state, flux) {
      var {meetingId} = state.params,
          meetingActions = flux.getActions('meeting');

      return meetingActions.fetch(meetingId);
    }
  },

  contextTypes: {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.object.isRequired
  },

  render: function() {
    var {meetingId} = this.context.router.getCurrentParams();

    return (
      <DocumentTitle title="Meeting">
        <FluxComponent 
          connectToStores={['meeting', 'currentUser']}
          stateGetter={([meetingStore, currentUserStore]) => ({
            meeting: meetingStore.getById(meetingId),
            isJoined: currentUserStore.isJoined(meetingId)
          })}>
          <MeetingOverview/>
        </FluxComponent>
      </DocumentTitle>
    );
  }

});

module.exports = MeetingHandler;