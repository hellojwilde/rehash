var {Store} = require('flummox');

var _ = require('lodash');

class QuestionStore extends Store {
  constructor(registry) {
    super();

    var agendaActionIds = registry.getActionIds('agenda');

    this.register(agendaActionIds.fetch, this.handleAgendaFetch);
    this.register(agendaActionIds.addQuestion, this.handleQuestionAdd);
    this.register(agendaActionIds.receiveAddQuestion, this.handleQuestionAdd);

    this.registry = registry;
    this.state = {};
  }

  getByTopicId(id) {
    return this.state[id] || [];
  }

  handleAgendaFetch({questions}) {
    this.setState(_.groupBy(questions, ({topicId}) => topicId));
  }

  handleQuestionAdd(question) {
    this.setState({
      [question.topicId]: this.getByTopicId(question.topicId).concat(question)
    });
  }
}

module.exports = QuestionStore;
