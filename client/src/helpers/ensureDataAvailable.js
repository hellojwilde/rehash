// Shamelessly based off of the existing work in:
// 
//  <https://github.com/rackt/react-router/blob/master/examples/async-data/
//   app.js#L121>
//  <https://github.com/acdlite/flummox-isomorphic-demo/blob/master/src/shared/
//   performRouteHandlerStaticMethod.js>
//   

function ensureDataAvailable(state, registry) {
  return Promise.all(
    state.routes
      .filter((route) => route.handler.ensureDataAvailable)
      .map((route) => Promise.resolve(
        route.handler.ensureDataAvailable(state, registry)
      ))
  );
}

module.exports = ensureDataAvailable;