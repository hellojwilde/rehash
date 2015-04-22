var {attachMediaStream, detachMediaStream} = require('helpers/WebRTCAdapter');

function getFirstFrame(stream) {
  return new Promise((resolve, reject) => {
    var videoNode = document.createElement('video');
    var width = videoNode.videowidth = 720;
    var height = videoNode.videoheight = 480;
    videoNode.muted = true;
    videoNode.autoplay = true;
    attachMediaStream(videoNode, stream);

    videoNode.addEventListener('playing', () => {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      var context = canvas.getContext('2d');
      context.fillRect(0, 0, width, height);
      context.drawImage(videoNode, 0, 0, width, height);

      videoNode.pause();
      detachMediaStream(videoNode);

      resolve(canvas.toDataURL('image/png'));
    });
  });
}


module.exports = getFirstFrame;