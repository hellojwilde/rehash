var React = require('react');
var IconButton = require('components/common/IconButton');

var BroadcastButton = React.createClass({

  propTypes: {
    meetingId: React.PropTypes.number.isRequired,
    onBroadcastStart: React.PropTypes.func.isRequired
  },

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  handleClick: function() {
    var webRTCActions = this.context.flux.getActions('webRTC');
    var meetingActions = this.context.flux.getActions('meeting');
    var {meetingId} = this.props;
    
    webRTCActions.connectAsHost(meetingId)
      .then(() => meetingActions.broadcastStart(meetingId))
      .then(() => this.props.onBroadcastStart());
  },

  render: function() {
    return (
      <IconButton 
        className="btn-lg btn-success btn-block" 
        icon="facetime-video" 
        onClick={this.handleClick}>
        Confirm Broadcast
      </IconButton>
    );
  }

});

module.exports = BroadcastButton;