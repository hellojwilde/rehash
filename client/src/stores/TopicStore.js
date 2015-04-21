var {Store} = require('flummox');

class TopicStore extends Store {
  constructor(registry) {
    super();

    var agendaActionIds = registry.getActionIds('agenda');

    this.register(agendaActionIds.fetch, this.handleAgendaFetch);

    this.registry = registry;
    this.state = {};
  }

  getByMeetingId(id) {
    return this.state[id];
  }

  handleAgendaFetch({meetingId, topics}) {
    this.setState({[meetingId]: topics});
  }
}

module.exports = TopicStore;
