var {Store} = require('flummox');

var _ = require('lodash');
var moment = require('moment');

function areUsersEqual(user, otherUser) {
  if (!(user && user.id && otherUser && otherUser.id)) {
    return false;
  } else {
    return user.id === otherUser.id;
  }
}

function hasEqualUser(arr, user) {
  return !!_.find(arr, areUsersEqual.bind(this, user));
}

class MeetingStore extends Store {
  constructor(registry) {
    super();

    var exploreActionIds = registry.getActionIds('explore');
    var meetingActionIds = registry.getActionIds('meeting');
    var broadcastActionIds = registry.getActionIds('broadcast');
    
    this.register(exploreActionIds.fetch, this.handleReceiveMeetings);

    this.register(meetingActionIds.fetch, this.handleReceiveMeeting);
    this.register(meetingActionIds.create, this.handleReceiveMeeting);
    this.register(meetingActionIds.update, this.handleReceiveMeeting);
    this.register(meetingActionIds.receive, this.handleReceiveMeeting);

    this.register(broadcastActionIds.start, this.handleReceiveBroadcastStart);
    this.register(broadcastActionIds.receiveStart, this.handleReceiveBroadcastStart);
    this.register(broadcastActionIds.end, this.handleReceiveBroadcastEnd);

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
      isHost: areUsersEqual(meeting.host, currentUser),
      isSubscriber: hasEqualUser(meeting.subscribers, currentUser),
      isAttendee: hasEqualUser(meeting.attendees, currentUser)
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

  handleReceiveBroadcastStart(broadcast) {
    var id = broadcast.id || broadcast;

    this.setState({
      [id]: _.assign(this.state[id], {status: 'broadcasting'})
    });
  }

  handleReceiveBroadcastEnd(meetingId) {
    this.setState({
      [meetingId]: _.assign(this.state[meetingId], {status: 'ended'})
    });
  }
}

module.exports = MeetingStore;
