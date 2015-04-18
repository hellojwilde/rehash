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
    meetingRelation: meetingRelationPropType.isRequired
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

  getLabel: function() {
    var {isHost, isAttendee} = this.props.meetingRelation;

    if (isHost) {
      return 'Hosting';
    } else if (isAttendee) {
      return 'Subscribed';
    } else {
      return 'Subscribe';
    }
  },

  render: function() {
    var {isHost, isAttendee} = this.props.meetingRelation;

    return (
      <IconButton
        className="btn-lg btn-default"
        icon={(isAttendee || isHost) ? 'ok' : 'plus'} 
        disabled={isHost}
        onClick={this.handleClick}>
        {this.getLabel()}
      </IconButton>
    );
  }

});

module.exports = SubscribeButton;