var FluxComponent = require('flummox/component');
var ModalStack = require('components/modal/ModalStack');
var React = require('react');
var {RouteHandler} = require('react-router');

var AppHandler = React.createClass({

  render: function() {
    return (
      <div className="AppHandler">
        <RouteHandler />
        <FluxComponent 
          connectToStores={['modal']}
          render={(data) => <ModalStack {...data}/>}
        />
      </div>
    );
  }

});

module.exports = AppHandler;