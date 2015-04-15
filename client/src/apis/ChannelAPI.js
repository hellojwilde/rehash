var {
  Broadcast_onChannelOpened, 
  Broadcast_onChannelMessage
} = require('components/meeting/broadcast/Broadcast');

var _ = require('lodash');

class ChannelAPI {
  constructor(registry) {
    var currentUserStore = registry.getStore('currentUser');

    currentUserStore.on('change', () => {
      if (currentUserStore.state.channelToken === null) {
        return;
      }

      console.log('we have a channel token! initialize the channel');

      this.channel = new goog.appengine.Channel(
        currentUserStore.state.channelToken
      );

      this.socket = this.channel.open({
        onopen: this.handleOpened,
        onmessage: this.handleMessage,
        onerror: this.handleError,
        onclose: this.handleClosed
      });
    });
  }

  handleOpened() {
    _.isFunction(Broadcast_onChannelOpened) && Broadcast_onChannelOpened();
    console.log('Channel opened.');
  }

  handleMessage(message) {
    console.log('S->C: ' + message.data);
    var msg = JSON.parse(message.data);

    // call actions to update resprective stores
    if(msg.type === 'userUpdate') { 
    }
    else if (msg.type === 'meetingUpdate') {
    }
    // for broadcast 
    else{
      // in this way, avoid setting global variables
      // will this work? what if Broadcast object has not been established yet?
      _.isFunction(Broadcast_onChannelMessage) && Broadcast_onChannelMessage(msg); 
    }
  }

  handleError() {
    console.log('Channel error.');
  }

  handleClosed() {
    console.log('Channel closed.');
  }
}

module.exports = ChannelAPI;