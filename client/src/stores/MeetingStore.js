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
    
    this.register(exploreActionIds.fetch, this.handleExploreFetch);

    this.register(meetingActionIds.fetch, this.handleMeeting);
    this.register(meetingActionIds.create, this.handleMeeting);
    this.register(meetingActionIds.update, this.handleMeeting);
    this.register(meetingActionIds.receive, this.handleMeeting);

    this.register(broadcastActionIds.start, this.handleBroadcastStart);
    this.register(broadcastActionIds.receiveStart, this.handleBroadcastStart);
    this.register(broadcastActionIds.end, this.handleBroadcastEnd);
    this.register(broadcastActionIds.receiveEnd, this.handleBroadcastEnd);

    this.registry = registry;
    this.state = {};
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

  handleExploreFetch(meetings) {
    if (meetings === null) {
      return;
    }

    this.setState(_.indexBy(meetings, 'id'));
  }

  handleMeeting(meeting) {
    if (meeting === null) {
      return;
    }

    this.setState({[meeting.id]: meeting});
  }

  handleBroadcastStart(broadcast) {
    var id = broadcast.id || broadcast;

    this.setState({
      [id]: _.assign(this.state[id], {status: 'broadcasting'})
    });
  }

  handleBroadcastEnd(meetingId) {
    this.setState({
      [meetingId]: _.assign(this.state[meetingId], {status: 'ended'})
    });
  }
}

module.exports = MeetingStore;
