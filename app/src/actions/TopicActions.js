var {Actions} = require('flummox');

class TopicActions extends Actions {
  create(discussionId, userId, content) {
    return {
      discussionId: discussionId,
      userId: userId,
      content: content
    };
  }
}

module.exports = TopicActions;