var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var DebriefBroadcast = React.createClass({
  render: function() {
    return (
      <div className="panel panel-default DebriefBroadcast">
        <div className="panel-body">
          <div id="container" ondblclick="enterFullScreen()">
            <div id="card">
              <div id="local">
                <video id="localVideo" autoplay="autoplay" muted="true"/>
              </div>
              <div id="remote">
                <video id="remoteVideo" autoplay="autoplay">
                </video>
                <div id="mini">
                  <video id="miniVideo" autoplay="autoplay" muted="true"/>
                </div>   
              </div>
            </div>
            <div id="chat">
              <div id="chat_mes_display">
                here should be dialogues of the conversation! 
              </div>
              <div id="chat_input">
                <input type="text" placeholder="Type Your Message Here" id="chat_input_text" name="message" />
                <button type="button" id="chat_input_submit"> SEND </button>
              </div>
            </div>   
          </div>
          <script src="/js/main.js"></script>
        </div>
      </div>
    );
  }

});

module.exports = DebriefBroadcast;