var React = require('react');
var {Link} = require('react-router');

var ensureCurrentUser = require('helpers/ensureCurrentUser');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./MeetingJoinButton.css');

var MeetingJoinButton = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    id: React.PropTypes.number.isRequired,
    isJoined: React.PropTypes.bool.isRequired
  },

  handleJoinClick: function() {
    var meetingActions = this.context.flux.getActions('meeting');

    ensureCurrentUser(
      this.context.flux,
      'In order to join an event, we need to you to be logged in.'
    ).then(() => meetingActions.join(this.props.id));
  },

  render: function() {
    if (this.props.isJoined) {
      return (
        <button
          className="btn btn-success btn-lg MeetingJoinButton"
          disabled={true}>
          <span className="glyphicon glyphicon-ok"></span> Joined
        </button>
      );
    }

    return (
      <button
        className="btn btn-success btn-lg MeetingJoinButton"
        onClick={this.handleJoinClick}>
        <span className="glyphicon glyphicon-plus"></span> Join
      </button>
    );
  }

});

module.exports = MeetingJoinButton;