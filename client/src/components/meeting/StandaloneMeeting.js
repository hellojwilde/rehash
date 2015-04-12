var React = require('react');
var Logo = require('components/common/Logo');

require('./StandaloneMeeting.css');

var StandaloneMeeting = React.createClass({

  render: function() {
    return (
      <div>
        <Logo className="StandaloneMeeting-logo"/>
        <div className="StandaloneMeeting-content">
          {this.props.children}
        </div>
      </div>
    );
  }

});

module.exports = StandaloneMeeting;