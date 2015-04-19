var React = require('react');
var IconButton = require('components/common/IconButton');

var ensureCurrentUser = require('helpers/ensureCurrentUser');
var meetingRelationPropType = require('types/meetingRelationPropType');

var SubscribeButton = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    meetingKey: React.PropTypes.string.isRequired,
    isAttendee: React.PropTypes.bool.isRequired
  },

  handleClick: function() {
    ensureCurrentUser(
      this.context.flux, 
      'In order to subscribe and notify you, we\'ll need you to log in.'
    ).then(() => {
      this.context.flux.getActions('meeting')
        .join(this.props.meetingKey);
    });
  },

  render: function() {
    var {isAttendee} = this.props;

    return (
      <IconButton
        className="btn-default"
        icon={(isAttendee) ? 'ok' : 'plus'} 
        disabled={isAttendee}
        onClick={this.handleClick}>
        {isAttendee ? 'Subscribed' : 'Subscribe'}
      </IconButton>
    );
  }

});

module.exports = SubscribeButton;