var FluxComponent = require('flummox/component');
var FluxRegistry = require('./FluxRegistry');
var React = require('react');
var Router = require('react-router');
var Routes = require('./Routes');

var ensureDataAvailable = require('./helpers/ensureDataAvailable');

var registry = new FluxRegistry();

// XXX Uncomment when there's proper deserialization magic in the page.
// registry.deserialize(window.initialStoreState);

Router.run(Routes, Router.HistoryLocation, function(Handler, state) {
  ensureDataAvailable(state, registry).then(() => {
    React.render(
      <FluxComponent flux={registry}><Handler/></FluxComponent>, 
      document.body
    )
  });
});
