var {Actions} = require('flummox');

class AgendaActions extends Actions {
  fetch(meetingId) {

  }

  createTopic(meetingId, userId, content) {
    return {
      meetingId: meetingId,
      userId: userId,
      content: content
    };
  },

  createQuestion(meetingId, topicId, userId, content) {
    return {
      meetingId: meetingId,
      topicId: topicId,
      userId: userId,
      content: content
    };
  }
}