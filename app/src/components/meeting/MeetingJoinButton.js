var React = require('react');
var {Link} = require('react-router');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./MeetingJoinButton.css');

var MeetingJoinButton = React.createClass({

  propTypes: {
    id: React.PropTypes.number,
    isJoined: React.PropTypes.bool,
    cost: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      isJoined: false,
      cost: 'FREE'
    };
  },

  handleClick: function() {
    this.context.flux.getActions('meeting')
      .join(this.props.id);
  },

  render: function() {
    if (this.props.isJoined) {
      return (
        <button
          className="btn btn-success btn-lg MeetingJoinButton"
          disabled={true}>
          <span className="MeetingJoinButton-major">
            <span className="glyphicon glyphicon-ok"></span> Joined
          </span>
        </button>
      );
    }

    return (
      <button
        className="btn btn-success btn-lg MeetingJoinButton"
        onClick={this.handleClick}>
        <span className="MeetingJoinButton-major">
          <span className="glyphicon glyphicon-plus"></span> Join
        </span>
        <span className="MeetingJoinButton-cost">
          {this.props.cost}
        </span>
      </button>
    );
  }

});

module.exports = MeetingJoinButton;