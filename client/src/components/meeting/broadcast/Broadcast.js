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
  },

  render: function() {
    return (
      <video ref="broadcast" autoPlay={true} {...this.props} />
    );
  }

});

module.exports = Broadcast;