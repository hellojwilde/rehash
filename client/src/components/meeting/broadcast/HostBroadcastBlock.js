var React = require('react');

var BroadcastPreview = require('components/meeting/broadcast/BroadcastPreview');
var HostBroadcastButton = require('components/meeting/broadcast/HostBroadcastButton');

var HostBroadcastBlock = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    webRTC: React.PropTypes.object.isRequired,
    meetingKey: React.PropTypes.string.isRequired,
    onBroadcastStart: React.PropTypes.func.isRequired
  },

  handleBroadcastPreviewButtonClick: function() {
    this.context.flux.getActions('webRTC')
      .connectAsHost(this.props.meetingKey);
    this.props.onBroadcastStart();
  },

  render: function() {
    var {localStream} = this.props.webRTC;

    if (!localStream) {
      return <HostBroadcastButton meetingKey={this.props.meetingKey} />;
    } else {
      return <BroadcastPreview 
        {...this.props}
        label="Preview"
        buttonLabel="Broadcast"
        onButtonClick={this.handleBroadcastPreviewButtonClick}
        buttonIcon="facetime-video"
      />;
    }
  }

});

module.exports = HostBroadcastBlock;