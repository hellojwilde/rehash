var {Store} = require('flummox');

var _ = require('lodash');

class QuestionStore extends Store {
  constructor(registry) {
    super();

    var agendaActionIds = registry.getActionIds('agenda');

    this.register(agendaActionIds.fetch, this.handleAgendaFetch);

    this.registry = registry;
    this.state = {};
  }

  getByTopicId(id) {
    return this.state[id];
  }

  handleAgendaFetch({questions}) {
    this.setState(_.groupBy(questions, ({topicId}) => topicId));
  }
}

module.exports = QuestionStore;
