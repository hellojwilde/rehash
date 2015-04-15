var FluxComponent = require('flummox/component');
var FluxRegistry = require('./FluxRegistry');
var React = require('react');
var Router = require('react-router');
var Routes = require('./Routes');

var ensureDataAvailable = require('./helpers/ensureDataAvailable');

var registry = new FluxRegistry();

registry.deserialize(window.initialStoreData);

Router.run(Routes, Router.HistoryLocation, function(Handler, state) {
 // ensureDataAvailable(state, registry).then(() => {
    React.render(
      <FluxComponent flux={registry}><Handler/></FluxComponent>, 
      document.body
    )
  //});
});
