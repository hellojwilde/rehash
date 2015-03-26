var FluxComponent = require('flummox/component');
var MeetingOverviewView = require('components/meeting/MeetingOverviewView');
var React = require('react');

var getMeetingWillTransitionTo = require('helpers/getMeetingWillTransitionTo');

var MeetingOverviewHandler = React.createClass({

  statics: {
    willTransitionTo: getMeetingWillTransitionTo('meeting-overview')
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
          return <MeetingOverviewView {...meeting}/>;
        }}
      />
    );
  }

});

module.exports = MeetingOverviewHandler;