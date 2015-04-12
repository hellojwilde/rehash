var FluxComponent = require('flummox/component');
var DocumentTitle = require('react-document-title');
var ModalStack = require('components/modal/ModalStack');
var React = require('react');
var {RouteHandler} = require('react-router');

var AppHandler = React.createClass({

  render: function() {
    return (
      <DocumentTitle title="Rehash">
        <div className="AppHandler">
          <RouteHandler />
          <FluxComponent 
            connectToStores={['modal']}
            render={(data) => <ModalStack {...data}/>}
          />
        </div>
      </DocumentTitle>
    );
  }

});

module.exports = AppHandler;