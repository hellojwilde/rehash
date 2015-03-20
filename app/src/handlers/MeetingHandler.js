var DocumentTitle = require('react-document-title');
var MeetingHeader = require('components/meeting/MeetingHeader');
var MeetingOverview = require('components/meeting/MeetingOverview');
var React = require('react');
var Footer = require('components/Footer');
var {State} = require('react-router');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./MeetingHandler.css');

var MeetingHandler = React.createClass({

  mixins: [State],

  statics: {
    ensureDataAvailable: function(state, flux) {
      var {meetingId} = state.params,
          meetingActions = flux.getActions('meeting');

      return meetingActions.fetch(meetingId);
    }
  },

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  // TODO: Replace all of this with flummox's FluxComponent as soon as we can
  //       move onto React 0.13 (currently blocked by react-router).

  getInitialState: function() {
    this.meetingStore = this.context.flux.getStore('meeting');
    this.currentUserStore = this.context.flux.getStore('currentUser');

    return this.getStoreState();
  },

  componentWillMount: function() {
    this.meetingStore.addListener('change', this.handleStoreChange);
    this.currentUserStore.addListener('change', this.handleStoreChange);
  },

  componentWillUnmount: function() {
    this.meetingStore.removeListener('change', this.handleStoreChange);
    this.currentUserStore.removeListener('change', this.handleStoreChange);
  },

  getStoreState: function() {
    var {meetingId} = this.getParams();

    return {
      meeting: this.meetingStore.getById(meetingId),
      isJoined: this.currentUserStore.isJoined(meetingId)
    };
  },

  handleStoreChange: function() {
    this.setState(this.getStoreState());
  },

  render: function() {
    return (
      <DocumentTitle title="Meeting">
        <div className="MeetingHandler">
          <MeetingHeader 
            {...this.state.meeting}
            isJoined={this.state.isJoined}
          />
          <MeetingOverview 
            {...this.state.meeting}
            className="MeetingHandler-content"
          />
          <Footer/>
        </div>
      </DocumentTitle>
    );
  }

});

module.exports = MeetingHandler;