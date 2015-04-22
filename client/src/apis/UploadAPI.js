var UploadAPI = {
  uploadFirstFrame: function(connectedUserId, meetingId, data) {
    var formData = new FormData();
    formData.append('img', data);
    formData.append('type', 'firstframe');
    formData.append('connectedUserId', connectedUserId);
    formData.append('meetingId', meetingId);

    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'POST',
        url: '/api/upload',
        data: formData,
        processData: false,
        contentType: false
      }).done(function(data) {
        console.log('Firstframe files successfully uploaded');
        resolve(data);
        // may want ot suspend user action during video upload
      }).fail(function(e){
        console.log('Firstframe files fail to upload');
        reject(e);
      });
    });
  }
};

module.exports = UploadAPI;