var CurrentUserActions = require('actions/CurrentUserActions');
var CurrentUserStore = require('stores/CurrentUserStore');
var ExampleAPI = require('apis/ExampleAPI');
var MeetingActions = require('actions/MeetingActions');
var MeetingStore = require('stores/MeetingStore');
var {Flummox} = require('flummox');

class FluxRegistry extends Flummox {
  constructor() {
    super();

    var api = new ExampleAPI(this);

    this.createActions('currentUser', CurrentUserActions, api);
    this.createActions('meeting', MeetingActions, api);

    this.createStore('currentUser', CurrentUserStore, this);
    this.createStore('meeting', MeetingStore, this);
  }
}

module.exports = FluxRegistry;