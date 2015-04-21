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
    return this.api.agendaAddTopic(meetingId, content);
  }

  addQuestion(meetingId, topicId, content) {
    return this.api.agendaAddQuestion(meetingId, topicId, content);
  }

  receiveAddTopic(topic) {
    return topic;
  }

  receiveAddQuestion(question) {
    return topic;
  }
}

module.exports = AgendaActions;