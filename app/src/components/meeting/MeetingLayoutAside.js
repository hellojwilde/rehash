var React = require('react');

// TODO: Make this stick to the top of the screen when we scroll down.

var MeetingLayoutAside = React.createClass({

  render: function() {
    return (
      <div className="col-sm-5 col-md-4">
        {this.props.children}
      </div>
    );
  }

});

module.exports = MeetingLayoutAside;