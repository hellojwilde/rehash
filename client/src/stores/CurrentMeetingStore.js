var {Store} = require('flummox');

class CurrentMeetingStore extends Store {
  constructor(registry) {
    super();

    var meetingActionIds = registry.getActionIds('meeting');

    this.registerAsync(meetingActionIds.open, this.handleMeetingOpenBegin);
    this.registerAsync(meetingActionIds.close, this.handleMeetingCloseBegin);

    this.registry = registry;
    this.state = {
      meetingId: null
    };
  }

  handleMeetingOpenBegin(meetingId) {
    this.setState({meetingId});
    console.log('open', meetingId)
  }

  handleMeetingCloseBegin(meetingId) {
    this.setState({meetingId: null});
    console.log('close')
  }
}

module.exports = CurrentMeetingStore;
