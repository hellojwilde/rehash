var {Actions} = require('flummox');
var WebRTCBroadcaster = require('helpers/WebRTCBroadcaster');
var WebRTCConnection = require('helpers/WebRTCConnection');

var invariant = require('react/lib/invariant');
var {requestUserMedia} = require('helpers/WebRTCAdapter')

class WebRTCActions extends Actions {
  constructor(registry, api) {
    super();
    
    this.registry = registry;
    this.api = api;
  }

  fetchTurn() {
    return Promise.resolve(null);

    // return new Promise((resolve, reject) => {
    //   var webRTCStore = this.registry.getStore('webRTC');
    //   var {pcConfig, turnUrl, isTurnFetchingComplete} = webRTCStore.state;

    //   // Ensure that we skip fetching turn if we already have it.
    //   if (isTurnFetchingComplete) {
    //     return resolve(null);
    //   }

    //   // Allow to skip turn by passing ts=false to apprtc.
    //   if (turnUrl == '') {
    //     return resolve(null);
    //   }

    //   for (var i = 0, len = pcConfig.iceServers.length; i < len; i++) {
    //     if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
    //       return resolve(null);
    //     }
    //   }

    //   resolve($.ajax({url: turnUrl, dataType: 'json'}));
    // });
  }

  prepareAsHost() {
    return requestUserMedia({audio: true, video: true});
  }

  connectAsHost() {
    var webRTCActions = this.registry.getActions('webRTC');
    var webRTCStore = this.registry.getStore('webRTC');
    var {localStream} = webRTCStore.state;

    invariant(
      localStream && !localStream.ended,
      'WebRTCActions: no localStream found; did you call prepareAsHost first?'
    );

    return webRTCActions.fetchTurn()
      .then(() => {
        return new WebRTCBroadcaster(
          this.registry,
          this.api,
          localStream
        );
      });
  }

  connectAsAttendee(hostConnectedUserKey) {
    var currentUserStore = this.registry.getStore('currentUser');
    var webRTCActions = this.registry.getActions('webRTC');
    
    return webRTCActions.fetchTurn()
      .then(() => {
        var connection = new WebRTCConnection(
          this.registry, 
          this.api, 
          hostConnectedUserKey
        );

        // XXX It's theoretically possible that there could be a race condition
        // where the response to this signalling message gets back before flux
        // finishes binding this to the store, but that's super unlikely.
  
        this.api.webRTCSendMessage(
          currentUserStore.state.connectedUserId,
          hostConnectedUserKey, 
          {type: 'offer-request'}
        );

        connection.on('addStream', webRTCActions.receiveRemoteStream);
        return connection;
      });
  }

  receiveRemoteStream(remoteStream) {
    return remoteStream;
  }

  receiveMessage(sender, message) {
    var webRTCStore = this.registry.getStore('webRTC');
    var {broadcaster, receiver} = webRTCStore.state;

    invariant(
      broadcaster || receiver,
      'No peer connection: did you call connectAsAttendee or connectAsHost?'
    );

    if (broadcaster) {
      broadcaster.receiveMessage(sender, message);
    } else if (receiver) {
      receiver.receiveMessage(message);
    }
  }

  disconnect() {
    return true;
  }
}

module.exports = WebRTCActions;