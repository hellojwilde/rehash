var MeetingHandler = require('handlers/MeetingHandler');
var React = require('react');
var {Route} = require('react-router');

var Routes = (
  <Route>
    <Route handler={MeetingHandler} path="/meeting/:meetingId"/>
  </Route>
);

module.exports = Routes;