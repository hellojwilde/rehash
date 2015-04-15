var React = require('react');
var IconButton = require('components/common/IconButton');

var ensureCurrentUser = require('helpers/ensureCurrentUser');

var SubscribeButton = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    meetingId: React.PropTypes.number.isRequired,
    isHost: React.PropTypes.bool.isRequired,
    isAttendee: React.PropTypes.bool.isRequired
  },

  handleClick: function() {
    ensureCurrentUser(
      this.context.flux, 
      'In order to subscribe and notify you, we\'ll need you to log in.'
    ).then(() => {
      this.context.flux.getActions('meeting')
        .join(this.props.meetingId);
    });


  },

  render: function() {
    var {isHost, isAttendee, ...otherProps} = this.props;
    var isSubscribed = isHost || isAttendee;

    return (
      <IconButton
        className="btn-lg btn-default"
        icon={isSubscribed ? 'ok' : 'plus'} 
        disabled={isHost}
        onClick={this.handleClick}>
        {isSubscribed ? 'Subscribed' : 'Subscribe'}
      </IconButton>
    );
  }

});

module.exports = SubscribeButton;