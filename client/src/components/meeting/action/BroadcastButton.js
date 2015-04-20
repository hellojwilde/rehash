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
    var broadcastActions = this.context.flux.getActions('broadcast');
    broadcastActions.start(this.props.meetingId)
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