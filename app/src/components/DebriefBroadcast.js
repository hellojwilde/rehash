var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./DebriefDescriptionPanel.css');

var DebriefBroadcast = React.createClass({

  render: function() {
    return (
      <div className="panel panel-default DebriefBroadcast">
        <div className="panel-body">
          <p className="lead">
             Broadcast Video shall be put here, or we can link it from here 
          </p>
        </div>
      </div>
    );
  }

});

module.exports = DebriefBroadcast;