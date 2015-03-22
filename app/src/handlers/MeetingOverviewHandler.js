var FluxComponent = require('flummox/component');
var MeetingNavigation = require('components/meeting/MeetingNavigation');
var MeetingOverviewView = require('components/meeting/MeetingOverviewView');
var React = require('react');

var MeetingOverviewHandler = React.createClass({

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
            <div className="MeetingOverviewHandler">
              {isJoined && (
                <MeetingNavigation meetingId={meetingId} title={'Overview'}/>
              )}
              <MeetingOverviewView {...meeting}/>
            </div>
          );
        }}
      />
    );
  }

});

module.exports = MeetingOverviewHandler;