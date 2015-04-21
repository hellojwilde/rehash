var {Store} = require('flummox');

var _ = require('lodash');

class AgendaStore extends Store {
  constructor(registry) {
    super();

    var agendaActionIds = registry.getActionIds('agenda');

    this.register(agendaActionIds.fetch, this.handleReceive);
    this.register(agendaActionIds.addTopic, this.handleReceiveTopic);
    this.register(agendaActionIds.addQuestion, this.handleReceiveQuestion);

    this.registry = registry;
    this.state = {};
  }

  getById(id) {
    return this.state[id];
  }

  handleReceive(agenda) {
    this.setState({[agenda.id]: agenda});
  }

  handleReceiveTopic(topic) {
    var agenda = this.getById(topic.meetingId);
    agenda.topics.push(topic);

    this.setState({[topic.meetingId]: agenda});
  }

  handleReceiveQuestion(question) {
    var agenda = this.getById(question.meetingId);
    var topic = _.find(agenda.topics, _.matchProperty(id, question.topicId));
    topic.questions.push(question);

    this.setState({[question.meetingId]: agenda});
  }
}

module.exports = AgendaStore;