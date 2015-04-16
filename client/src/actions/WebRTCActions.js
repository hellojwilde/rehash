var {Actions} = require('flummox');

var {requestUserMedia} = require('helpers/WebRTCAdapter');

class WebRTCActions extends Actions {
  constructor(registry, api) {
    super();
    
    this.registry = registry;
    this.api = api;
  }

  connectAsHost(meetingId) {

  }

  connectAsAttendee(meetingId) {

  }

  fetchTurn() {
    return new Promise((resolve, reject) => {
      var webRTCStore = this.registry.getStore('webRTC');
      var {pcConfig, turnUrl, isTurnFetchingComplete} = webRTCStore.state;

      // Ensure that we skip fetching turn if we already have it.
      if (isTurnFetchingComplete) {
        return resolve(null);
      }

      // Allow to skip turn by passing ts=false to apprtc.
      if (turnUrl == '') {
        return resolve(null);
      }

      for (var i = 0, len = pcConfig.iceServers.length; i < len; i++) {
        if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
          return resolve(null);
        }
      }

      var currentDomain = document.domain;
      if (currentDomain.search('localhost') === -1 &&
          currentDomain.search('apprtc') === -1) {
        // Not authorized domain. Try with default STUN instead.
        return resolve(null);
      }

      // TODO: check out this part 
      return resolve(null);
      //return $.ajax({url: turnUrl, dataType: 'json'});
    });
  }

  requestUserMedia() {
    return requestUserMedia({audio: true, video: true});
  }

  receiveMessage(message) {

  }
}

module.exports = WebRTCActions;