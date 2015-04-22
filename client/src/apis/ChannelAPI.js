const CHANNEL_DELAY = 1500;

class ChannelAPI {
  constructor(registry) {
    var currentUserStore = registry.getStore('currentUser');
    var channel = null;
    var channelToken = null;

    this.registry = registry;

    currentUserStore.on('change', () => {
      var currentChannelToken = currentUserStore.state.channelToken;
      if (currentChannelToken === null || 
          currentChannelToken === channelToken) {
        return;
      }

      console.log(
        'ChannelAPI: have a channel token!', 
        currentChannelToken
      );

      // XXX For some reason the channel API doesn't work if we call it right 
      // after load here, and not with a setTimeout delay. Who knows why?
      var connect = () => {
        this.initialNow = +Date.now();

        channelToken = currentChannelToken;
        channel = new goog.appengine.Channel(channelToken);
        channel.open({
          onopen: this.handleOpened.bind(this),
          onerror: () => console.log('ChannelAPI: opened.'),
          onmessage: this.handleMessage.bind(this),
          onclose: this.handleClosed.bind(this)
        });
      };

      setTimeout(connect, CHANNEL_DELAY);
    });
  }

  handleOpened() {
    console.log('ChannelAPI: opened after ', +Date.now() - this.initialNow);
  }

  handleMessage(message) {
    var msg = JSON.parse(message.data);
    
    var agendaActions = this.registry.getActions('agenda');
    var broadcastActions = this.registry.getActions('broadcast');
    var meetingActions = this.registry.getActions('meeting');
    var webRTCActions = this.registry.getActions('webRTC');

    console.log('ChannelAPI: message: ',  msg);
    
    switch (msg.type) {
      case 'meetingCreate':
      case 'meetingUpdate':
        meetingActions.receive(msg.meeting);
        break;
      case 'agendaTopicAdd':
        agendaActions.receiveAddTopic(msg.topic);
        break;
      case 'agendaQuestionAdd':
        agendaActions.receiveAddQuestion(msg.question);
        break;
      case 'broadcastStart':
        broadcastActions.receiveStart(msg.broadcast);
        break;
      case 'broadcastSelectCard':
        broadcastActions.receiveSelectCard(msg.topicId, msg.questionId);
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

  handleClosed() {
    console.log('ChannelAPI: closed. Reconnecting.');

    this.registry.getActions('currentUser').connectedUserFetch();
  }
}

module.exports = ChannelAPI;