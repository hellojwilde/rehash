var WebRTCAPI = {
  sendMessage: function(roomKey, message) {
    var msgString = JSON.stringify(message);
    console.log('C->S: ' + msgString);
    // NOTE: AppRTCClient.java searches & parses this line; update there when
    // changing here.
    var path = '/message?r=' + roomKey;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    xhr.send(msgString);
  }
};

module.exports = WebRTCAPI;