/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* More information about these options at jshint.com/docs/options */
/* global mozRTCIceCandidate, mozRTCPeerConnection,
mozRTCSessionDescription, webkitRTCPeerConnection */
/* exported trace,requestUserMedia */

'use strict';

var RTCPeerConnection = null;
var RTCIceCandidate = null;
var RTCSessionDescription = null;
var getUserMedia = null;
var webrtcDetectedBrowser = null;
var webrtcDetectedVersion = null;

function trace(text) {
  // This function is used for logging.
  if (text[text.length - 1] === '\n') {
    text = text.substring(0, text.length - 1);
  }
  if (window.performance) {
    var now = (window.performance.now() / 1000).toFixed(3);
    console.log(now + ': ' + text);
  } else {
    console.log(text);
  }
}

if (navigator.mozGetUserMedia) {
  console.log('This appears to be Firefox');

  webrtcDetectedBrowser = 'firefox';

  webrtcDetectedVersion =
    parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1], 10);

  // The RTCPeerConnection object.
  RTCPeerConnection = function(pcConfig, pcConstraints) {
    // .urls is not supported in FF yet.
    if (pcConfig && pcConfig.iceServers) {
      for (var i = 0; i < pcConfig.iceServers.length; i++) {
        if (pcConfig.iceServers[i].hasOwnProperty('urls')) {
          pcConfig.iceServers[i].url = pcConfig.iceServers[i].urls;
          delete pcConfig.iceServers[i].urls;
        }
      }
    }
    return new mozRTCPeerConnection(pcConfig, pcConstraints);
  };

  // The RTCSessionDescription object.
  RTCSessionDescription = mozRTCSessionDescription;

  // The RTCIceCandidate object.
  RTCIceCandidate = mozRTCIceCandidate;

  // getUserMedia shim (only difference is the prefix).
  // Code from Adam Barth.
  getUserMedia = navigator.mozGetUserMedia.bind(navigator);
  navigator.getUserMedia = getUserMedia;

  // Shim for MediaStreamTrack.getSources.
  MediaStreamTrack.getSources = function(successCb) {
    setTimeout(function() {
      var infos = [
        {kind: 'audio', id: 'default', label:'', facing:''},
        {kind: 'video', id: 'default', label:'', facing:''}
      ];
      successCb(infos);
    }, 0);
  };

  // Creates ICE server from the URL for FF.
  window.createIceServer = function(url, username, password) {
    var iceServer = null;
    var urlParts = url.split(':');
    if (urlParts[0].indexOf('stun') === 0) {
      // Create ICE server with STUN URL.
      iceServer = {
        'url': url
      };
    } else if (urlParts[0].indexOf('turn') === 0) {
      if (webrtcDetectedVersion < 27) {
        // Create iceServer with turn url.
        // Ignore the transport parameter from TURN url for FF version <=27.
        var turnUrlParts = url.split('?');
        // Return null for createIceServer if transport=tcp.
        if (turnUrlParts.length === 1 ||
          turnUrlParts[1].indexOf('transport=udp') === 0) {
          iceServer = {
            'url': turnUrlParts[0],
            'credential': password,
            'username': username
          };
        }
      } else {
        // FF 27 and above supports transport parameters in TURN url,
        // So passing in the full url to create iceServer.
        iceServer = {
          'url': url,
          'credential': password,
          'username': username
        };
      }
    }
    return iceServer;
  };

  window.createIceServers = function(urls, username, password) {
    var iceServers = [];
    // Use .url for FireFox.
    for (var i = 0; i < urls.length; i++) {
      var iceServer =
        window.createIceServer(urls[i], username, password);
      if (iceServer !== null) {
        iceServers.push(iceServer);
      }
    }
    return iceServers;
  };
} else if (navigator.webkitGetUserMedia) {
  console.log('This appears to be Chrome');

  webrtcDetectedBrowser = 'chrome';
  // Temporary fix until crbug/374263 is fixed.
  // Setting Chrome version to 999, if version is unavailable.
  var result = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
  if (result !== null) {
    webrtcDetectedVersion = parseInt(result[2], 10);
  } else {
    webrtcDetectedVersion = 999;
  }

  // Creates iceServer from the url for Chrome M33 and earlier.
  window.createIceServer = function(url, username, password) {
    var iceServer = null;
    var urlParts = url.split(':');
    if (urlParts[0].indexOf('stun') === 0) {
      // Create iceServer with stun url.
      iceServer = {
        'url': url
      };
    } else if (urlParts[0].indexOf('turn') === 0) {
      // Chrome M28 & above uses below TURN format.
      iceServer = {
        'url': url,
        'credential': password,
        'username': username
      };
    }
    return iceServer;
  };

  // Creates an ICEServer object from multiple URLs.
  window.createIceServers = function(urls, username, password) {
    return {
      'urls': urls,
      'credential': password,
      'username': username
    };
  };

  // The RTCPeerConnection object.
  RTCPeerConnection = function(pcConfig, pcConstraints) {
    return new webkitRTCPeerConnection(pcConfig, pcConstraints);
  };

  RTCIceCandidate = window.RTCIceCandidate;
  RTCSessionDescription = window.RTCSessionDescription;

  // Get UserMedia (only difference is the prefix).
  // Code from Adam Barth.
  getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
  navigator.getUserMedia = getUserMedia;
} else {
  console.log('Browser does not appear to be WebRTC-capable');
}

// Attach a media stream to an element.
function attachMediaStream(element, stream) {
  if (typeof element.srcObject !== 'undefined') {
    element.srcObject = stream;
  } else if (typeof element.mozSrcObject !== 'undefined') {
    element.mozSrcObject = stream;
  } else if (typeof element.src !== 'undefined') {
    element.src = URL.createObjectURL(stream);
  } else {
    console.log('Error attaching stream to element.');
  }
}

function reattachMediaStream(to, from) {
  to.src = from.src;
}

function detachMediaStream(element) {
  element.src = '';
}

// Returns the result of getUserMedia as a Promise.
function requestUserMedia(constraints) {
  return new Promise(function(resolve, reject) {
    var onSuccess = function(stream) {
      resolve(stream);
    };
    var onError = function(error) {
      reject(error);
    };

    try {
      getUserMedia(constraints, onSuccess, onError);
    } catch (e) {
      reject(e);
    }
  });
}

// Takes in a steam for which video/audio is recorded
function startRecording(element, stream) {
  if (navigator.mozGetUserMedia) {
    console.log('This appears to be Firefox');
    var mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'video/webm';
    mediaRecorder.ondataavailable = function (blob) {
        // POST/PUT "Blob" using FormData/XHR2
        var blobURL = URL.createObjectURL(blob);
        alert('<a href="' + blobURL + '">' + blobURL + '</a>');
        uploadRecording(blob);
    };
    mediaRecorder.start(3000);
    return mediaRecorder;
  }
  else if (navigator.webkitGetUserMedia) {
    console.log('This appears to be Chrome');
    var multiStreamRecorder = new MultiStreamRecorder(stream);
    multiStreamRecorder.video = element;
    // multiStreamRecorder.audioChannels = 1;
    multiStreamRecorder.ondataavailable = function (blobs) {
      // blobs.audio
      // blobs.video
      var videoblobURL = URL.createObjectURL(blobs.video);
      var audioblobURL = URL.createObjectURL(blobs.audio);  
      // currently only upload audio
      uploadRecording(blobs.audio);
    };
    multiStreamRecorder.start(3 * 1000);
    return multiStreamRecorder;
  }
  else {
    console.log('Browser not supported. Please use Chrome/Firefox'); 
  }
}

function stopRecording(mediaRecorder){
  mediaRecorder.stop()
}

function uploadRecording(blob) {
  var formData = new FormData();
  formData.append('fname', 'test.webm');
  formData.append('data', blob);
  formData.append('type', 'recording');
  $.ajax({
      type: 'POST',
      url: '/upload',
      data: formData,
      processData: false,
      contentType: false
  }).done(function(data) {
    console.log('Recording files successfully uploaded');
    // may want ot suspend user action during video upload
  }).fail(function(e){
    console.log('Recording files fail to upload');
  });
}


module.exports = {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  getUserMedia,
  requestUserMedia,
  attachMediaStream,
  reattachMediaStream,
  detachMediaStream,
  webrtcDetectedBrowser,
  webrtcDetectedVersion,
  startRecording,
  stopRecording
};