var React = require('react');
var IconButton = require('components/common/IconButton');

var JoinButton = React.createClass({

  render: function() {
    return (
      <IconButton
        {...this.props}
        className="btn-success btn-lg btn-block"
        icon="plus">
        Join
      </IconButton>
    );
  }

});

module.exports = JoinButton;