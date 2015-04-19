var React = require('react');

var meetingRelationPropType = require('types/meetingRelationPropType');
var {attachMediaStream} = require('helpers/WebRTCAdapter');

var Broadcast = React.createClass({

  propTypes: {
    meetingRelation: meetingRelationPropType.isRequired,
    webRTC: React.PropTypes.object.isRequired,
  },

  // temporarily added to test if this works
  // change to ExampleAPI after rest of the code works
  sendMessage: function(message) {
    // temporarily hardcoded meetingId
    meetingId = 0
    var msgString = JSON.stringify(message);
    console.log('C->S: ' + msgString);
    path = '/message?r=' + meetingId;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', path, true);
    xhr.send(msgString);
  }

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
  },

  render: function() {
    return (
      <video ref="broadcast" autoPlay={true} {...this.props} />
    );
  }

});

module.exports = Broadcast;