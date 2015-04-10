var AppHandler = require('handlers/AppHandler');
var React = require('react');
var {Route} = require('react-router');

var Routes = (
  <Route handler={AppHandler}/>
);

module.exports = Routes;