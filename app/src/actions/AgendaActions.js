var {Actions} = require('flummox');

class AgendaActions extends Actions {
  constructor(api) {
    super();
    this.api = api;
  }

  fetch(meetingId) {
    return this.api.agendaFetch(meetingId);
  }

  createTopic(meetingId, content) {
    return this.api.agendaCreateTopic(meetingId, content);
  }

  createQuestion(meetingId, topicId, content) {
    return this.api.agendaCreateQuestion(meetingId, topicId, content);
  }

  remoteCreateTopic(meetingId, userId, content) {
    return {
      meetingId: meetingId,
      userId: userId,
      content: content
    };
  } 

  remoteCreateQuestion(meetingId, topicId, userId, content) {
    return {
      meetingId: meetingId,
      topicId: topicId,
      userId: userId,
      content: content
    };
  }
}

module.exports = AgendaActions;