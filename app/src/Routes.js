var MeetingHandler = require('handlers/MeetingHandler');
var MeetingOverviewHandler = require('handlers/MeetingOverviewHandler');
var AppHandler = require('handlers/AppHandler');
var React = require('react');
var {Route, DefaultRoute} = require('react-router');

var Routes = (
  <Route handler={AppHandler}>
    <Route handler={MeetingHandler} path="/meeting/:meetingId">
     <DefaultRoute name="meeting-overview" handler={MeetingOverviewHandler}/>
    </Route>
  </Route>
);

module.exports = Routes;