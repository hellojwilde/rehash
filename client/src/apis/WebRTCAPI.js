var WebRTCAPI = {

  sendMessage: function(meetingKey, message) {
    message.namespace = 'webRTC';
    console.log('WebRTCAPI: C->S: ', message);

    return $.ajax({
      method: 'POST',
      url: '/message?r=' + meetingKey,
      dataType: 'json',
      data: message
    });
  }

};

module.exports = WebRTCAPI;