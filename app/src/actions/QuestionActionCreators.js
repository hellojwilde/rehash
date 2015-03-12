var ActionTypes = require('constants/ActionTypes');
var Dispatcher = require('Dispatcher');

var QuestionActionCreators = {
  createQuestion: function(topicID, text) {
    Dispatcher.dispatch({
      type: ActionTypes.CREATE_QUESTION,
      topicID: topicID,
      text: text
    });
  }
};

module.exports = QuestionActionCreators;