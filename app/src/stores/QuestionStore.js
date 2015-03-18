var {Store} = require('flummox');

class QuestionStore extends Store {
  constructor(flux) {
    super();

    var meetingActions = flux.getActions('meeting'),
        questionActions = flux.getActions('question');

    this.register(meetingActions.fetch, this.handleMeetingFetch);
    this.register(questionActions.create, this.handleQuestionCreate);

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

