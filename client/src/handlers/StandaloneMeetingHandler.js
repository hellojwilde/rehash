var React = require('react');
var StandaloneMeeting = require('components/meeting/StandaloneMeeting');
var {RouteHandler} = require('react-router');

var StandaloneMeetingHandler = React.createClass({

  render: function() {
    return (
      <StandaloneMeeting>
        <RouteHandler/>
      </StandaloneMeeting>
    );
  }

});

module.exports = StandaloneMeetingHandler;