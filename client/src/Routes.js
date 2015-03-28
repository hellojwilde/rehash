var MeetingHandler = require('handlers/MeetingHandler');
var MeetingOverviewHandler = require('handlers/MeetingOverviewHandler');
var MeetingBroadcastHandler = require('handlers/MeetingBroadcastHandler');
var AppHandler = require('handlers/AppHandler');
var React = require('react');
var {Route, DefaultRoute} = require('react-router');

var Routes = (
  <Route handler={AppHandler}>
    <Route handler={MeetingHandler}>
      <Route 
        name="meeting-overview" 
        path="/meeting/:meetingId"
        handler={MeetingOverviewHandler}
      />
      <Route 
        name="meeting-broadcast"
        path="/meeting/:meetingId/broadcast"
        handler={MeetingBroadcastHandler}
      />
    </Route>
  </Route>
);

module.exports = Routes;