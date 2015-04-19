var React = require('react');
var IconButton = require('components/common/IconButton');

require('./HostBroadcastButton.css')

var HostBroadcastButton = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    meetingKey: React.PropTypes.string.isRequired
  },

  handleClick: function() {
    this.context.flux.getActions('webRTC')
      .prepareAsHost(this.props.meetingKey);
  },

  render: function() {
    return (
      <div className="HostBroadcastButton">
        <IconButton
          className="btn-lg btn-block btn-primary BeforeMeeting-broadcast-button"
          icon="facetime-video"
          onClick={this.handleClick}>
          Broadcast
        </IconButton>
        <small className="HostBroadcastButton-note text-muted">
          {'We\'ll let you check your video before you go live.'}
        </small>
      </div>
    );
  }

});

module.exports = HostBroadcastButton;