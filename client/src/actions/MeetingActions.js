var {Actions} = require('flummox');

var _ = require('lodash');

class MeetingActions extends Actions {
  constructor(registry, api) {
    super();
    
    this.registry = registry;
    this.api = api;
  }

  fetch(id) {
    var meetingStore = this.registry.getStore('meeting');
    var meeting = meetingStore.getById(id);
    if (meeting) {
      return Promise.resolve(meeting);
    }

    return this.api.meetingFetch(id);
  }

  create(meeting) {
    var currentUserStore = this.registry.getStore('currentUser');

    return this.api.meetingCreate(
      currentUserStore.state.connectedUserId, 
      meeting
    );
  }

  update(id, meeting) {
    var currentUserStore = this.registry.getStore('currentUser');

    return this.api.meetingUpdate(
      currentUserStore.state.connectedUserId,
      id,
      meeting
    );
  }

  subscribe(id) {
    var currentUserStore = this.registry.getStore('currentUser');

    return this.api.meetingSubscribe(
      currentUserStore.state.connectedUserId,
      id
    );
  }

  open(id) {
    var agendaActions = this.registry.getActions('agenda');
    var broadcastActions = this.registry.getActions('broadcast');
    var meetingActions = this.registry.getActions('meeting');
    var webRTCActions = this.registry.getActions('webRTC');

    var currentUserStore = this.registry.getStore('currentUser');
    var broadcastStore = this.registry.getStore('broadcast');
    var meetingStore = this.registry.getStore('meeting');
    
    return Promise.all([
      meetingActions.fetch(id),
      agendaActions.fetch(id),
      this.api.meetingOpen(currentUserStore.state.connectedUserId, id)
    ]).then(() => {
      var meeting = meetingStore.getById(id);
      var meetingRelation = meetingStore.getCurrentUserRelationById(id);

      if (meeting.status !== 'broadcasting') {
        return;
      }

      return broadcastActions.fetch(id).then((broadcast) => {
        if (meetingRelation.isHost) {
          webRTCActions.prepareAsHost(id)
            .then(() => broadcastActions.start(id))
        } else {
          webRTCActions.connectAsAttendee(broadcast.hostConnectedUser);
        }
      });
    });
  }

  close(id) {
    var currentUserStore = this.registry.getStore('currentUser');
    var broadcastActions = this.registry.getActions('broadcast');
    var webRTCActions = this.registry.getActions('webRTC');
    var meetingStore = this.registry.getStore('meeting');

    webRTCActions.disconnect();

    return this.api.meetingClose(currentUserStore.state.connectedUserId, id)
      .then(() => {
        var meeting = meetingStore.getById(id);
        var meetingRelation = meetingStore.getCurrentUserRelationById(id);

        if (meeting.status === 'broadcasting' && meetingRelation.isHost) {
          return broadcastActions.end(id);
        }
      });
  }

  receive(meeting) {
    return meeting;
  }
}

module.exports = MeetingActions;
