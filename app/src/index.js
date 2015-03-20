var React = require('react');
var Router = require('react-router');
var Routes = require('./Routes');
var FluxRegistry = require('./FluxRegistry');

var flux = new FluxRegistry();

// 
// Shamelessly based off of the existing work in:
// 
//  <https://github.com/rackt/react-router/blob/master/examples/async-data/
//   app.js#L121>
//  <https://github.com/acdlite/flummox-isomorphic-demo/blob/master/src/shared/
//   performRouteHandlerStaticMethod.js>
//   

function ensureDataAvailable(state, flux) {
  return Promise.all(
    state.routes
      .filter((route) => route.handler.ensureDataAvailable)
      .map((route) => {
        return Promise.resolve(route.handler.ensureDataAvailable(state, flux));
      })
  );
}

Router.run(Routes, Router.HashLocation, function(Handler, state) {
  ensureDataAvailable(state, flux)
    .then(() => {
      React.withContext({flux}, () => {
        React.render(<Handler/>, document.body);
      });
    });
});
