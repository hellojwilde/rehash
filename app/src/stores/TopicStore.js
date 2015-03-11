var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('Dispatcher');
var ActionTypes = require('constants/ActionTypes');

var assign = require('object-assign')

var _topics = [
  {
    topicID: 1,
    text: 'Challenges with data analysis at Forrst. '
  },
  {
    topicID: 2,
    text: 'Discussion of how to balance quantitative and qualitative data.'
  },
  {
    topicID: 3,
    text: 'Building citizens engaged with data.'
  }
];

var TopicStore = assign({}, EventEmitter.prototype, {

  CHANGE_EVENT: 'change',

  get: function() {
    return _topics;
  }

});

TopicStore.dispatchToken = Dispatcher.register(function(action) {

  switch(action.type) {

    default:
      // Do nothing.
  
  }

});

module.exports = TopicStore;
