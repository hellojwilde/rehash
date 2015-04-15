var {Broadcast_onChannelOpened, Broadcast_onChannelMessage} = require('components/meeting/broadcast/Broadcast');
var FluxRegistry = require('FluxRegistry')


function onChannelOpened(){
  Broadcast_onChannelOpened();
}
function onChannelMessage(message) {
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
    Broadcast_onChannelMessage(msg); 
  }
}
function onChannelError () {
  console.log('Channel error.');
}
function onChannelClosed () {
  console.log('Channel closed.');
}

var ChannelAPI = React.createClass({
  openChannel: function() {
    console.log('Opening channel.');
    // is this the right way to retrieve the channelToken? 
    var channel = new goog.appengine.Channel(window.initialStoreData.currentUser.channelToken);
    var handler = {
      'onopen': this.onChannelOpened,
      'onmessage': this.onChannelMessage,
      'onerror': this.onChannelError,
      'onclose': this.onChannelClosed
    };
    socket = channel.open(handler);
  }
});

module.exports = ChannelAPI;