var CurrentUserActions = require('actions/CurrentUserActions');
var CurrentUserStore = require('stores/CurrentUserStore');
var ExampleAPI = require('apis/ExampleAPI');
var MeetingActions = require('actions/MeetingActions');
var MeetingStore = require('stores/MeetingStore');
var ModalActions = require('actions/ModalActions');
var ModalStore = require('stores/ModalStore');
var {Flummox} = require('flummox');

class FluxRegistry extends Flummox {
  constructor() {
    super();

    var api = new ExampleAPI(this);

    this.createActions('currentUser', CurrentUserActions, api);
    this.createActions('meeting', MeetingActions, api);
    this.createActions('modal', ModalActions);

    this.createStore('currentUser', CurrentUserStore, this);
    this.createStore('meeting', MeetingStore, this);
    this.createStore('modal', ModalStore, this);
  }
}

module.exports = FluxRegistry;