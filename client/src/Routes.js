var AppHandler = require('handlers/AppHandler');
var ExploreHandler = require('handlers/ExploreHandler');
var MeetingHandler = require('handlers/MeetingHandler');
var StandaloneMeetingHandler = require('handlers/StandaloneMeetingHandler');
var React = require('react');
var {Route} = require('react-router');

var Routes = (
  <Route handler={AppHandler}>
    <Route name="explore" handler={ExploreHandler} path="/">
      <Route 
        name="explore_meeting" 
        handler={MeetingHandler} 
        path="/explore/meeting/:meetingKey"
      />
    </Route>
    <Route handler={StandaloneMeetingHandler}>
      <Route 
        name="meeting" 
        handler={MeetingHandler} 
        path="/meeting/:meetingKey"
      />
    </Route>
  </Route>
);

module.exports = Routes;