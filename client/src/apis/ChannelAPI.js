
class ChannelAPI {
  constructor(registry) {
    this.registry = registry;

    var currentUserStore = this.registry.getStore('currentUser');
    var channel = null;

    currentUserStore.on('change', () => {
      if (currentUserStore.state.channelToken === null ||
          channel !== null) {
        return;
      }

      console.log('ChannelAPI: have a channel token!');

      channel = new goog.appengine.Channel(
        currentUserStore.state.channelToken
      );

      channel.open({
        onopen: this.handleOpened,
        onmessage: this.handleMessage.bind(this),
        onerror: this.handleError,
        onclose: this.handleClosed
      });
    });
  }

  handleOpened() {
    console.log('ChannelAPI: opened.');
  }

  handleMessage(message) {
    var msg = JSON.parse(message.data);
    
    var broadcastActions = this.registry.getActions('broadcast');
    var meetingActions = this.registry.getActions('meeting');
    var webRTCActions = this.registry.getActions('webRTC');

    console.log('ChannelAPI: message: ',  msg);
    
    switch (msg.type) {
      case 'meetingCreate':
      case 'meetingUpdate':
        meetingActions.receive(msg.meeting);
        break;
      case 'broadcastStart':
        broadcastActions.receiveStart(msg.broadcast);
        break;
      case 'broadcastEnd':
        broadcastActions.receiveEnd(msg.meetingId);
        break;
      case 'webRTCMessage':
        webRTCActions.receiveMessage(
          msg.sender,
          JSON.parse(msg.message)
        );
        break;
    }
  }

  handleError() {
    console.log('ChannelAPI: error.');
  }

  handleClosed() {
    console.log('ChannelAPI: closed.');
  }
}

module.exports = ChannelAPI;