var React = require('react');
var IconButton = require('components/common/IconButton');

var BroadcastButton = React.createClass({

  propTypes: {
    meetingKey: React.PropTypes.string.isRequired,
    onBroadcastStart: React.PropTypes.func.isRequired
  },

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  handleClick: function() {
    this.context.flux.getActions('webRTC')
      .connectAsHost(this.props.meetingKey);
    this.props.onBroadcastStart();
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