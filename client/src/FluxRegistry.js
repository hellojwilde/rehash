var AgendaActions = require('actions/AgendaActions');
var BroadcastActions = require('actions/BroadcastActions');
var BroadcastStore = require('stores/BroadcastStore');
// var ChannelAPI = require('apis/ChannelAPI');
var CurrentUserStore = require('stores/CurrentUserStore');
var ExampleAPI = require('apis/ExampleAPI');
var ExploreActions = require('actions/ExploreActions');
var MeetingActions = require('actions/MeetingActions');
var MeetingStore = require('stores/MeetingStore');
var ModalActions = require('actions/ModalActions');
var ModalStore = require('stores/ModalStore');
var UserActions = require('actions/UserActions');
var UserStore = require('stores/UserStore');
var WebRTCActions = require('actions/WebRTCActions');
var WebRTCStore = require('stores/WebRTCStore');
var {Flummox} = require('flummox');

class FluxRegistry extends Flummox {
  constructor() {
    super();

    this.createActions('agenda', AgendaActions, this, ExampleAPI);
    this.createActions('broadcast', BroadcastActions, this, ExampleAPI);
    this.createActions('explore', ExploreActions, this, ExampleAPI);
    this.createActions('meeting', MeetingActions, this, ExampleAPI);
    this.createActions('modal', ModalActions);
    this.createActions('user', UserActions, this, ExampleAPI);
    this.createActions('webRTC', WebRTCActions, this, ExampleAPI);

    this.createStore('broadcast', BroadcastStore, this);
    this.createStore('currentUser', CurrentUserStore, this);
    this.createStore('meeting', MeetingStore, this);
    this.createStore('modal', ModalStore, this);
    this.createStore('user', UserStore, this);
    this.createStore('webRTC', WebRTCStore, this);

    //new ChannelAPI(this);
  }
}

module.exports = FluxRegistry;