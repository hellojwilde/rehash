var React = require('react');
var {Link} = require('react-router');

var ensureCurrentUser = require('helpers/ensureCurrentUser');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./MeetingJoinButton.css');

var MeetingJoinButton = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired,
    router: React.PropTypes.func.isRequired
  },

  propTypes: {
    id: React.PropTypes.number.isRequired,
    isParticipant: React.PropTypes.bool.isRequired,
    isHost: React.PropTypes.bool.isRequired
  },

  handleJoinClick: function() {
    var meetingActions = this.context.flux.getActions('meeting');

    var currentUserPromise = ensureCurrentUser(
      this.context.flux,
      'In order to join an event, we need to you to be logged in.'
    );

    currentUserPromise
      .then(() => meetingActions.join(this.props.id))
      .then(() => this.context.router.replaceWith(
        'meeting-broadcast',
        this.context.router.getCurrentParams()
      ));
  },

  render: function() {
    if (this.props.isParticipant) {
      return (
        <button
          className="btn btn-success btn-lg MeetingJoinButton"
          disabled={true}>
          <span className="glyphicon glyphicon-ok"></span>{' '}Joined
          {this.props.isHost && (<span className="label">Host</span>)}
        </button>
      );
    }

    return (
      <button
        className="btn btn-primary btn-lg MeetingJoinButton"
        onClick={this.handleJoinClick}>
        <span className="glyphicon glyphicon-plus"></span> Join
      </button>
    );
  }

});

module.exports = MeetingJoinButton;