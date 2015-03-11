var React = require('react');
var {Link} = require('react-router');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./DebriefJoinButton.css');

var DebriefJoinButton = React.createClass({

  propTypes: {
    isJoined: React.PropTypes.bool,
    cost: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      isJoined: false,
      cost: '$1.99'
    };
  },

  render: function() {
    if (this.props.isJoined) {
      return (
        <Link
          to="unpaid"
          role="button"
          className="btn btn-success btn-lg DebriefJoinButton"
          disabled={true}>
          <span className="DebriefJoinButton-major">
            <span className="glyphicon glyphicon-ok"></span> Joined
          </span>
        </Link>
      );
    }

    return (
      <Link
        to="paid" 
        role="button" 
        className="btn btn-success btn-lg DebriefJoinButton">
        <span className="DebriefJoinButton-major">
          <span className="glyphicon glyphicon-plus"></span> Join
        </span>
        <span className="DebriefJoinButton-cost">
          $1.99
        </span>
      </Link>
    );
  }

});

module.exports = DebriefJoinButton;