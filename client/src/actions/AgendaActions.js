var {Actions} = require('flummox');

class AgendaActions extends Actions {
  constructor(registry, api) {
    super();

    this.registry = registry;
    this.api = api;
  }

  fetch(meetingId) {
    return this.api.agendaFetch(meetingId);
  }

  addTopic(meetingId, content) {
    var currentUserStore = this.registry.getStore('currentUser');

    return this.api.agendaAddTopic(
      currentUserStore.state.connectedUserId,
      meetingId,
      content
    );
  }

  addQuestion(meetingId, topicId, content) {
    var currentUserStore = this.registry.getStore('currentUser');

    return this.api.agendaAddQuestion(
      currentUserStore.state.connectedUserId,
      meetingId,
      topicId,
      content
    );
  }

  receiveAddTopic(topic) {
    return topic;
  }

  receiveAddQuestion(question) {
    return question;
  }
}

module.exports = AgendaActions;