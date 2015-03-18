var {Flummox} = require('flummox');

var CurrentUserActions = require('actions/CurrentUserActions');
var CurrentUserStore = require('stores/CurrentUserStore');
var MeetingActions = require('actions/MeetingActions');
var MeetingStore = require('stores/MeetingStore');
var QuestionActions = require('actions/QuestionActions');
var QuestionStore = require('stores/QuestionStore');
var TopicActions = require('actions/TopicActions');
var TopicStore = require('stores/TopicStore');
var UserActions = require('actions/UserActions');
var UserStore = require('stores/UserStore');

class Flux extends Flummox {
  constructor() {
    super();

    this.createActions('currentUser', CurrentUserActions);
    this.createActions('question', QuestionActions);
    this.createActions('meeting', MeetingActions);
    this.createActions('topic', TopicActions);
    this.createActions('user', UserActions);

    this.createStore('currentUser', CurrentUserStore);
    this.createStore('question', QuestionStore);
    this.createStore('meeting', MeetingStore);
    this.createStore('topic', TopicStore);
    this.createStore('user', UserStore);
  }
}

module.exports = Flux;