var React = require('react');
var Router = require('react-router');
var Routes = require('./Routes');
var FluxRegistry = require('./FluxRegistry');
var FluxComponent = require('flummox/component');

// 
// Shamelessly based off of the existing work in:
// 
//  <https://github.com/rackt/react-router/blob/master/examples/async-data/
//   app.js#L121>
//  <https://github.com/acdlite/flummox-isomorphic-demo/blob/master/src/shared/
//   performRouteHandlerStaticMethod.js>
//   

function ensureDataAvailable(state) {
  return Promise.all(
    state.routes
      .filter((route) => route.handler.ensureDataAvailable)
      .map((route) => Promise.resolve(
        route.handler.ensureDataAvailable(state)
      ))
  );
}

Router.run(Routes, Router.HashLocation, function(Handler, state) {
  ensureDataAvailable(state).then(() => {
    React.render(
      <FluxComponent flux={FluxRegistry}>
        <Handler/>
      </FluxComponent>, 
      document.body
    )
  });
});
