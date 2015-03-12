var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('Dispatcher');
var ActionTypes = require('constants/ActionTypes');

var assign = require('keymirror')

var _questions = [];

var QuestionStore = assign({}, EventEmitter.prototype, {

  CHANGE_EVENT: 'change',

  emitChange: function() {
    this.emit(this.CHANGE_EVENT);
  },

  getAllForTopic: function(topicID) {
    return _questions.filter((question) => question.topicID === topicID);
  }

});

QuestionStore.dispatchToken = Dispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.CREATE_QUESTION:
      _questions.push({
        topicID: action.topicID,
        text: action.text
      });
      QuestionStore.emitChange();
      break;

    default:
      // Do nothing.

  }

});

module.exports = QuestionStore;
