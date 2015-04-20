const SDP_CONSTRAINTS = {
  'mandatory': {
    'OfferToReceiveAudio': true,
    'OfferToReceiveVideo': true
  }
};

function getIceCandidateType(candidateSDP) {
  if (candidateSDP.indexOf("typ relay ") >= 0)
    return "TURN";
  if (candidateSDP.indexOf("typ srflx ") >= 0)
    return "STUN";
  if (candidateSDP.indexOf("typ host ") >= 0)
    return "HOST";
  return "UNKNOWN";
}

function getDefaultCodec(mLine, payload) {
  var elements = mLine.split(' ');
  var newLine = new Array();
  var index = 0;
  for (var i = 0; i < elements.length; i++) {
    if (index === 3) // Format of media starts from the fourth.
      newLine[index++] = payload; // Put target payload to the first.
    if (elements[i] !== payload)
      newLine[index++] = elements[i];
  }
  return newLine.join(' ');
}

function getSdp(sdpLine, pattern) {
  var result = sdpLine.match(pattern);
  return (result && result.length == 2)? result[1]: null;
}

function getSdpLinesWithoutCN(sdpLines, mLineIndex) {
  var mLineElements = sdpLines[mLineIndex].split(' ');
  // Scan from end for the convenience of removing an item.
  for (var i = sdpLines.length-1; i >= 0; i--) {
    var payload = getSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
    if (payload) {
      var cnPos = mLineElements.indexOf(payload);
      if (cnPos !== -1) {
        // Remove CN payload from m line.
        mLineElements.splice(cnPos, 1);
      }
      // Remove CN line in sdp
      sdpLines.splice(i, 1);
    }
  }

  sdpLines[mLineIndex] = mLineElements.join(' ');
  return sdpLines;
}

function getWithStereoIfPossible(sdp) {
  var sdpLines = sdp.split('\r\n');

  // Find opus payload.
  for (var i = 0; i < sdpLines.length; i++) {
    if (sdpLines[i].search('opus/48000') !== -1) {
      var opusPayload = getSdp(sdpLines[i], /:(\d+) opus\/48000/i);
      break;
    }
  }
  var fmtpLineIndex;
  // Find the payload in fmtp line.
  for (var i = 0; i < sdpLines.length; i++) {
    if (sdpLines[i].search('a=fmtp') !== -1) {
      var payload = getSdp(sdpLines[i], /a=fmtp:(\d+)/ );
      if (payload === opusPayload) {
        fmtpLineIndex = i;
        break;
      }
    }
  }
  // No fmtp line found.
  if (fmtpLineIndex === null)
    return sdp;

  // Append stereo=1 to fmtp line.
  // sdpLines[fmtpLineIndex] = sdpLines[fmtpLineIndex].concat(' stereo=1');

  sdp = sdpLines.join('\r\n');
  return sdp;
}

// Set |codec| as the default audio codec if it's present.
// The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.
function getPreferredAudioCodec(sdp, codec) {
  var fields = codec.split('/');
  if (fields.length != 2) {
    console.log('Invalid codec setting: ' + codec);
    return sdp;
  }
  var name = fields[0];
  var rate = fields[1];
  var sdpLines = sdp.split('\r\n');

  // Search for m line.
  for (var i = 0; i < sdpLines.length; i++) {
      if (sdpLines[i].search('m=audio') !== -1) {
        var mLineIndex = i;
        break;
      }
  }
  if (mLineIndex === null)
    return sdp;

  // If the codec is available, set it as the default in m line.
  for (var i = 0; i < sdpLines.length; i++) {
    if (sdpLines[i].search(name + '/' + rate) !== -1) {
      var regexp = new RegExp(':(\\d+) ' + name + '\\/' + rate, 'i');
      var payload = getSdp(sdpLines[i], regexp);
      if (payload)
        sdpLines[mLineIndex] = getDefaultCodec(sdpLines[mLineIndex], payload);
      break;
    }
  }

  // Remove CN in m line and sdp.
  sdpLines = getSdpLinesWithoutCN(sdpLines, mLineIndex);
  sdp = sdpLines.join('\r\n');
  return sdp;
}

function getMergedConstraints(cons1, cons2) {
  var merged = cons1;
  for (var name in cons2.mandatory) {
    merged.mandatory[name] = cons2.mandatory[name];
  }
  merged.optional.concat(cons2.optional);
  return merged;
}

module.exports = {
  SDP_CONSTRAINTS,
  getIceCandidateType,
  getDefaultCodec,
  getSdp,
  getSdpLinesWithoutCN,
  getWithStereoIfPossible,
  getPreferredAudioCodec,
  getMergedConstraints
};