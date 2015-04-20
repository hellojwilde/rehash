var React = require('react');

var meetingRelationPropType = require('types/meetingRelationPropType');
var {attachMediaStream} = require('helpers/WebRTCAdapter');

var Broadcast = React.createClass({

  propTypes: {
    meetingRelation: meetingRelationPropType.isRequired,
    webRTC: React.PropTypes.object.isRequired,
  },

  componentDidMount: function() {
    this.attachWebRTCStream();
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.webRTC.localStream !== this.props.webRTC.localStream ||
        prevProps.webRTC.remoteStream !== this.props.webRTC.remoteStream) {
      this.attachWebRTCStream();
    }
  },

  attachWebRTCStream: function() {
    var {meetingRelation, webRTC} = this.props;
    var videoNode = this.refs['broadcast'].getDOMNode();
    attachMediaStream(
      videoNode, 
      meetingRelation.isHost ? webRTC.localStream : webRTC.remoteStream
    );
    // Send the first frame to server 
    if (meetingRelation.isHost) {
      imageDataURL = getFirstFrame();
      var formData = new FormData();
      formData.append('data', imageDataURL);
      formData.append('type', 'firstframe');
      $.ajax({
          type: 'POST',
          url: '/upload',
          data: formData,
          processData: false,
          contentType: false
      }).done(function(data) {
        console.log('Firstframe files successfully uploaded');
        // may want ot suspend user action during video upload
      }).fail(function(e){
        console.log('Firstframe files fail to upload');
      });
    }
  },

  getFirstFrame: function() {
    var videoNode = this.refs['broadcast'].getDOMNode();
    var width = videoNode.videowidth;
    var height = videoNode.videoheight;
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext('2d');

    // Snap
    context.fillRect(0, 0, width, height);
    context.drawImage(videoNode, 0, 0, width, height);  
    return convas.toDataURL();
  },

  render: function() {
    var {meetingRelation} = this.props;

    return (
      <video 
        ref="broadcast" 
        muted={meetingRelation.isHost} 
        autoPlay={true}
        {...this.props}
      />
    );
  }

});

module.exports = Broadcast;