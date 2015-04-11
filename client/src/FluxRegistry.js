var AgendaActions = require('actions/AgendaActions');
var CurrentUserStore = require('stores/CurrentUserStore');
var ExampleAPI = require('apis/ExampleAPI');
var ExploreActions = require('actions/ExploreActions');
var MeetingActions = require('actions/MeetingActions');
var MeetingStore = require('stores/MeetingStore');
var ModalActions = require('actions/ModalActions');
var ModalStore = require('stores/ModalStore');
var {Flummox} = require('flummox');

class FluxRegistry extends Flummox {
  constructor() {
    super();

    this.createActions('agenda', AgendaActions, this, ExampleAPI);
    this.createActions('explore', ExploreActions, this, ExampleAPI);
    this.createActions('meeting', MeetingActions, this, ExampleAPI);
    this.createActions('modal', ModalActions);

    this.createStore('currentUser', CurrentUserStore, this);
    this.createStore('meeting', MeetingStore, this);
    this.createStore('modal', ModalStore, this);
  }
}

module.exports = FluxRegistry;