var {Store} = require('flummox');

class QuestionStore extends Store {
  constructor(flux) {
    super();

    var meetingActionIds = flux.getActionIds('meeting'),
        questionActionIds = flux.getActionIds('question');

    this.register(meetingActionIds.fetch, this.handleMeetingFetch);
    this.register(questionActionIds.create, this.handleQuestionCreate);

    this.state = {};
  }

  getAllForTopic(topicId) {
    return this.state[topicId] || [];
  }

  handleMeetingFetch(meeting) {

  }

  handleQuestionCreate(question) {
    var questions = this.getAllForTopic(question.topicId);

    this.setState({
      [question.topicId]: questions.concat(question)
    });
  }
}

module.exports = QuestionStore;

