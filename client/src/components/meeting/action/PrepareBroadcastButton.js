var React = require('react');
var IconButton = require('components/common/IconButton');

var PrepareBroadcastButton = React.createClass({

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
      <IconButton
        className="btn-lg btn-block btn-primary"
        icon="facetime-video"
        onClick={this.handleClick}>
        Broadcast
      </IconButton>
    );
  }

});

module.exports = PrepareBroadcastButton;