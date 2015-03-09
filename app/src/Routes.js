var Debrief = require('handlers/Debrief');
var DebriefUnpaid = require('handlers/DebriefUnpaid');
var DebriefPaid = require('handlers/DebriefPaid');
var Home = require('handlers/Home');
var Router = require('react-router');
var React = require('react');

var {Route, DefaultRoute} = Router;

var Routes = (
  <Route>
    <Route handler={Home} name="home" path="/" />
    <Route handler={Debrief}>
      <Route handler={DebriefUnpaid} name="unpaid" path="/d/experts"/>
      <Route handler={DebriefPaid} name="paid" path="/d/experts/paid"/>
    </Route>
  </Route>
);

module.exports = Routes;