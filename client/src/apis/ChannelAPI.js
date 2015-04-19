
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
        onmessage: this.handleMessage,
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

    var msg = JSON.parse(message.data);
    if (msg.namespace) {
      var namespaceActions = this.registry.getActions(msg.namespace); 
      featureActions.receiveMessage(msg);
    }
    else {
      // need to take care of messages that dont have namespace at all
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