var FluxComponent = require('flummox/component');
var MeetingOverview = require('components/meeting/MeetingOverview');
var React = require('react');

var MeetingOverviewHandler = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.func.isRequired
  },

  render: function() {
    var {meetingId} = this.context.router.getCurrentParams();

    return (
      <FluxComponent 
        connectToStores={{meeting: (store) => store.getById(meetingId)}}>
        <MeetingOverview/>
      </FluxComponent>
    );
  }

});

module.exports = MeetingOverviewHandler;