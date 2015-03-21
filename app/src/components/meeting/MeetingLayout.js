var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./MeetingLayout.css');

var MeetingLayout = React.createClass({

  render: function() {
    return (
      <div className="MeetingLayout container">
        <div className="row">
          {this.props.children}
        </div>
      </div>
    );
  }

});

module.exports = MeetingLayout;