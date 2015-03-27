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
    return (
      <FluxComponent 
        connectToStores={['meeting']}
        stateGetter={([meetingStore]) => {
          var {meetingId} = this.context.router.getCurrentParams();
          return meetingStore.getById(meetingId);
        }}
        render={(meeting) => <MeetingOverviewView {...meeting}/>}
      />
    );
  }

});

module.exports = MeetingOverviewHandler;