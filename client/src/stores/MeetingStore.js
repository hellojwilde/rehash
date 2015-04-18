var {Store} = require('flummox');

var _ = require('lodash');
var moment = require('moment');

class MeetingStore extends Store {
  constructor(registry) {
    super();

    var exploreActionIds = registry.getActionIds('explore');
    var meetingActionIds = registry.getActionIds('meeting');
    
    this.register(exploreActionIds.fetch, this.handleExploreFetch);
    this.register(meetingActionIds.fetch, this.handleMeetingFetch);
    this.register(meetingActionIds.create, this.handleMeetingCreate);

    this.registry = registry;
    this.state = {};
  }

  getAll() {
    return _.values(this.state);
  }

  getByKey(meetingKey) {
    return this.state[meetingKey];
  }

  getCurrentUserRelationByKey(meetingKey) {
    // XXX This will break when we start supporting logouts and logins of
    // users without page reloads! Over the long term, we should probably move
    // this functionality into a different store that will autoupdate whenever
    // the relations change.

    var currentUserStore = this.registry.getStore('currentUser');
    var currentUser = currentUserStore.state.user;
    var meeting = this.getByKey(meetingKey);

    return {
      isHost: meeting.host.key === currentUser.key,
      isAttendee: !!_.find(meeting.attendees, ({key}) => key === currentUser.key)
    };
  }

  handleExploreFetch(meetings) {
    this.setState(_.indexBy(meetings, 'key'));
  }

  handleMeetingFetch(meeting) {
    this.setState({[meeting.key]: meeting});
  }

  handleMeetingCreate(meeting) {
    this.setState({[meeting.key]: meeting})
  }
}

module.exports = MeetingStore;
