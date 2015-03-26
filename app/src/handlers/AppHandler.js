var FluxComponent = require('flummox/component');
var Footer = require('components/Footer');
var ModalStack = require('components/modals/ModalStack');
var React = require('react');
var {RouteHandler} = require('react-router');

var AppHandler = React.createClass({

  render: function() {
    return (
      <div className="AppHandler">
        <RouteHandler/>
        <Footer/>
        <FluxComponent connectToStores={['modal']}>
          <ModalStack/>
        </FluxComponent>
      </div>
    );
  }

});

module.exports = AppHandler;