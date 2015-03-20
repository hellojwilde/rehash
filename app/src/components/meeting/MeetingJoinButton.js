var React = require('react');
var {Link} = require('react-router');

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

  handleClick: function() {
    var meetingActions = this.context.flux.getActions('meeting');
    meetingActions.join(this.props.id);
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
        onClick={this.handleClick}>
        <span className="glyphicon glyphicon-plus"></span> Join
      </button>
    );
  }

});

module.exports = MeetingJoinButton;