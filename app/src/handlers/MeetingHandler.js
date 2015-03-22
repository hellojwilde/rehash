var DocumentTitle = require('react-document-title');
var FluxComponent = require('flummox/component');
var FluxRegistry = require('FluxRegistry');
var MeetingHeader = require('components/meeting/MeetingHeader');
var React = require('react');
var {RouteHandler} = require('react-router');

var MeetingHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state) {
      var {meetingId} = state.params,
          meetingActions = FluxRegistry.getActions('meeting');

      return meetingActions.fetch(meetingId);
    },
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
          isJoined: currentUserStore.isJoined(meetingId)
        })}
        render={(storeState) => {
          var {meeting, isJoined} = storeState;

          return (
            <DocumentTitle title={meeting.title}>
              <div className="MeetingHandler">
                <MeetingHeader {...meeting} isJoined={isJoined} />
                <RouteHandler/>
              </div>
            </DocumentTitle>
          );
        }}
      />
    );
  }

});

module.exports = MeetingHandler;