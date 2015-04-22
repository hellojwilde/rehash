var AgendaActions = require('actions/AgendaActions');
var API = require('apis/API');
var BroadcastActions = require('actions/BroadcastActions');
var BroadcastStore = require('stores/BroadcastStore');
var ChannelAPI = require('apis/ChannelAPI');
var CurrentMeetingStore = require('stores/CurrentMeetingStore');
var CurrentUserActions = require('actions/CurrentUserActions');
var CurrentUserStore = require('stores/CurrentUserStore');
var ExploreActions = require('actions/ExploreActions');
var MeetingActions = require('actions/MeetingActions');
var MeetingStore = require('stores/MeetingStore');
var ModalActions = require('actions/ModalActions');
var ModalStore = require('stores/ModalStore');
var QuestionStore = require('stores/QuestionStore');
var TopicStore = require('stores/TopicStore');
var UploadAPI = require('apis/UploadAPI');
var UserActions = require('actions/UserActions');
var UserStore = require('stores/UserStore');
var WebRTCActions = require('actions/WebRTCActions');
var WebRTCStore = require('stores/WebRTCStore');
var {Flummox} = require('flummox');

class FluxRegistry extends Flummox {
  constructor() {
    super();

    this.createActions('agenda', AgendaActions, this, API);
    this.createActions('broadcast', BroadcastActions, this, API, UploadAPI);
    this.createActions('currentUser', CurrentUserActions, this, API);
    this.createActions('explore', ExploreActions, this, API);
    this.createActions('meeting', MeetingActions, this, API);
    this.createActions('modal', ModalActions);
    this.createActions('user', UserActions, this, API);
    this.createActions('webRTC', WebRTCActions, this, API);

    this.createStore('topic', TopicStore, this);
    this.createStore('question', QuestionStore, this);
    this.createStore('broadcast', BroadcastStore, this);
    this.createStore('currentMeeting', CurrentMeetingStore, this);
    this.createStore('currentUser', CurrentUserStore, this);
    this.createStore('meeting', MeetingStore, this);
    this.createStore('modal', ModalStore, this);
    this.createStore('user', UserStore, this);
    this.createStore('webRTC', WebRTCStore, this);

    new ChannelAPI(this);
  }
}

module.exports = FluxRegistry;