var {Actions} = require('flummox');

class WebRTCActions extends Actions {
  constructor(registry, api) {
    super();
    
    this.registry = registry;
    this.api = api;
  }

  fetchTurnIfNeeded() {
    return new Promise((resolve, reject) => {
      var webRTCStore = this.registry.getStore('webRTC');
      var {turnUrl} = webRTCStore.state;

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
}

module.exports = WebRTCActions;