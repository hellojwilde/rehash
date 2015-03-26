var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./AgendaOnline.css');

var AgendaOnline = React.createClass({

  render: function() {
    return (
      <div className="AgendaOnline">
        <h3 className="AgendaOnline-title">Online</h3>

        <img 
          src="http://placehold.it/30x30" 
          className="img-thumbnail AgendaOnline-thumbnail"
        />
        <img 
          src="http://placehold.it/30x30" 
          className="img-thumbnail AgendaOnline-thumbnail"
        />
        <img 
          src="http://placehold.it/30x30" 
          className="img-thumbnail AgendaOnline-thumbnail"
        />
      </div>
    );
  }

});

module.exports = AgendaOnline;