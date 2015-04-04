var MeetingHandler = require('handlers/MeetingHandler');
var MeetingInviteHandler = require('handlers/MeetingInviteHandler');
var MeetingBroadcastHandler = require('handlers/MeetingBroadcastHandler');
var AppHandler = require('handlers/AppHandler');
var React = require('react');
var {Route, DefaultRoute} = require('react-router');

var Routes = (
  <Route handler={AppHandler}>
    <Route handler={MeetingHandler}>
      <Route 
        name="meeting-invite" 
        path="/meeting/:meetingId"
        handler={MeetingInviteHandler}
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