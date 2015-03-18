var React = require('react');
var Router = require('react-router');
var Routes = require('./Routes');
var Flux = require('./Flux');

var flux = new FluxRegistry();

Router.run(Routes, Router.HistoryLocation, function(Handler) {
  React.withContext({flux}, function() {
    React.render(<Handler/>, document.body);
  });
});
