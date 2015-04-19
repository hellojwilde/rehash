var {Store} = require('flummox');

var _ = require('lodash');
var moment = require('moment');

class MeetingStore extends Store {
  constructor(registry) {
    super();

    var exploreActionIds = registry.getActionIds('explore');
    var meetingActionIds = registry.getActionIds('meeting');
    
    this.register(exploreActionIds.fetch, this.handleReceiveMeetings);
    this.register(meetingActionIds.fetch, this.handleReceiveMeeting);
    this.register(meetingActionIds.create, this.handleReceiveMeeting);
    this.register(meetingActionIds.update, this.handleReceiveMeeting);
    this.register(meetingActionIds.receive, this.handleReceiveMeeting);

    this.registry = registry;
    this.state = {};
  }

  getAll() {
    return _.values(this.state);
  }

  getById(meetingId) {
    return this.state[+meetingId];
  }

  getCurrentUserRelationById(meetingId) {
    // XXX This will break when we start supporting logouts and logins of
    // users without page reloads! Over the long term, we should probably move
    // this functionality into a different store that will autoupdate whenever
    // the relations change.

    var currentUserStore = this.registry.getStore('currentUser');
    var currentUser = currentUserStore.state.user;
    var meeting = this.getById(meetingId);

    return {
      isHost: !!currentUser && meeting.host.id === currentUser.id,
      isAttendee: !!currentUser && !!_.find(
        meeting.attendees, 
        ({key}) => id === currentUser.id
      )
    };
  }

  handleReceiveMeetings(meetings) {
    this.setState(_.indexBy(meetings.map((meeting) => {
      meeting.start = moment.utc(meeting.start);
      return meeting;
    }), 'id'));
  }

  handleReceiveMeeting(meeting) {
    meeting.start = moment.utc(meeting.start);
    this.setState({[meeting.id]: meeting});
  }
}

module.exports = MeetingStore;
