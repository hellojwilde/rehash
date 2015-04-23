var {Store} = require('flummox');

var moment = require('moment');

const EXPIRY_DURATION = moment.duration(2, 'minutes');

class ExploreStore extends Store {
  constructor(registry) {
    super();

    var exploreActionIds = registry.getActionIds('explore');
    var meetingActionIds = registry.getActionIds('meeting');

    this.register(exploreActionIds.fetch, this.handleExploreFetch);

    this.register(meetingActionIds.create, this.handleMeeting);
    this.register(meetingActionIds.receive, this.handleMeeting);

    this.registry = registry;
    this.state = {
      lastFetchReceived: null,
      meetings: []
    };
  }

  isExpired() {
    return (
      this.state.lastFetchReceived === null ||
      moment().subtract(EXPIRY_DURATION).isAfter(this.state.lastFetchReceived)
    );
  }

  handleExploreFetch(meetings) {
    if (meetings === null) {
      return;
    }

    this.setState({
      lastFetchReceived: moment(),
      meetings: meetings
    });
  }

  handleMeeting(meeting) {
    if (meeting === null) {
      return;
    }

    this.setState({
      meetings: [meeting].concat(this.state.meetings)
    });
  }
}

module.exports = ExploreStore;