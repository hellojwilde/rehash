var {Actions} = require('flummox');

class QuestionActions extends Actions {
  create(topicId, userId, content) {
    return {
      topicId: topicId,
      userId: userId,
      content: content
    };
  }
}

module.exports = QuestionActions;