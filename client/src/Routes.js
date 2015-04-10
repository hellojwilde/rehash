var AppHandler = require('handlers/AppHandler');
var ExploreHandler = require('handlers/ExploreHandler');
var React = require('react');
var {Route} = require('react-router');

var Routes = (
  <Route handler={AppHandler}>
    <Route handler={ExploreHandler}/>
  </Route>
);

module.exports = Routes;