var WebRTCAPI = {

  sendMessage: function(meetingId, message) {
    message.namespace = 'webRTC';
    console.log('WebRTCAPI: C->S: ', message);

    return $.ajax({
      method: 'POST',
      url: '/message?r=' + meetingId,
      dataType: 'json',
      data: message
    });
  }

};

module.exports = WebRTCAPI;