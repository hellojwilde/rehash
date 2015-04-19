
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
    console.log('ChannelAPI: message: ' + message.data);

    var webRTCActions = this.registry.getActions('webRTC');
    var meetingActions = this.registry.getActions('meeting');

    var msg = JSON.parse(message.data);
    switch (msg.type) {
      case 'meetingCreate':
      case 'meetingUpdate':
        meetingActions.receive(msg.meeting);
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