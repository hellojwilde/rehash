var MeetingHandler = require('handlers/MeetingHandler');
var AppHandler = require('handlers/AppHandler');
var React = require('react');
var {Route} = require('react-router');

var Routes = (
  <Route handler={AppHandler}>
    <Route name="meeting" handler={MeetingHandler} path="/meeting/:meetingId"/>
  </Route>
);

module.exports = Routes;