var React = require('react');
var DocumentTitle = require('react-document-title');
var Meeting = require('components/meeting/Meeting')
var FluxComponent = require('flummox/component');

var MeetingHandler = React.createClass({

  statics: {
    ensureDataAvailable: function(state, registry) {
      var {meetingKey} = state.params;
      return registry.getActions('meeting').fetch(meetingKey)
    }
  },

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  render: function() {
    console.log('sdfasdfjkhsadfjkahsdf')

    var {meetingKey} = this.context.router.getCurrentParams();

    return (
      <FluxComponent 
        connectToStores={['meeting', 'currentUser']}
        stateGetter={([meetingStore, currentUserStore]) => ({
          meeting: meetingStore.getByKey(meetingKey),
          isAttendee: currentUserStore.isAttendee(meetingKey),
          isHost: currentUserStore.isHost(meetingKey)
        })}
        render={(state) => {
          console.log('dsffd', meetingKey, state)
          // <DocumentTitle title={`${state.meeting.title} - Rehash`}>
          return (<DocumentTitle title={`- Rehash`}>
            <Meeting {...state} />
          </DocumentTitle>);
        }}
      />
    );
  }

});

module.exports = MeetingHandler;