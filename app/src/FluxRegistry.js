var CurrentUserActions = require('actions/CurrentUserActions');
var CurrentUserStore = require('stores/CurrentUserStore');
var ExampleAPI = require('apis/ExampleAPI');
var MeetingActions = require('actions/MeetingActions');
var MeetingStore = require('stores/MeetingStore');
var ModalActions = require('actions/ModalActions');
var ModalStore = require('stores/ModalStore');
var AgendaStore = require('stores/AgendaStore');
var AgendaActions = require('actions/AgendaActions');
var {Flummox} = require('flummox');

class FluxRegistry extends Flummox {
  constructor() {
    super();

    this.createActions('agenda', AgendaActions, ExampleAPI);
    this.createActions('currentUser', CurrentUserActions, ExampleAPI);
    this.createActions('meeting', MeetingActions, ExampleAPI);
    this.createActions('modal', ModalActions);

    this.createStore('agenda', AgendaStore, this);
    this.createStore('currentUser', CurrentUserStore, this);
    this.createStore('meeting', MeetingStore, this);
    this.createStore('modal', ModalStore, this);
  }
}

module.exports = new FluxRegistry();