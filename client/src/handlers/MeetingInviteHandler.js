var FluxComponent = require('flummox/component');
var MeetingInviteView = require('components/meeting/MeetingInviteView');
var React = require('react');

var getMeetingWillTransitionTo = require('helpers/getMeetingWillTransitionTo');

var MeetingInviteHandler = React.createClass({

  statics: {
    willTransitionTo: getMeetingWillTransitionTo('meeting-invite')
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
        render={(meeting) => <MeetingInviteView {...meeting}/>}
      />
    );
  }

});

module.exports = MeetingInviteHandler;