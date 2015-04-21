var {Store} = require('flummox');

class TopicStore extends Store {
  constructor(registry) {
    super();

    var agendaActionIds = registry.getActionIds('agenda');

    this.register(agendaActionIds.fetch, this.handleAgendaFetch);
    this.register(agendaActionIds.addTopic, this.handleTopicAdd);
    this.register(agendaActionIds.receiveAddTopic, this.handleTopicAdd);

    this.registry = registry;
    this.state = {};
  }

  getByMeetingId(id) {
    return this.state[id] || [];
  }

  handleAgendaFetch({meetingId, topics}) {
    this.setState({[meetingId]: topics});
  }

  handleTopicAdd(topic) {
    this.setState({
      [topic.meetingId]: this.getByMeetingId(topic.meetingId).concat(topic)
    });
  }
}

module.exports = TopicStore;
