var Debrief = require('handlers/Debrief');
var DebriefUnpaid = require('handlers/DebriefUnpaid');
var Router = require('react-router');
var React = require('react');

var {Route, DefaultRoute} = Router;

var Routes = (
  <Route handler={Debrief}>
    <Route handler={DebriefUnpaid} path="/"/>
  </Route>
);

module.exports = Routes;