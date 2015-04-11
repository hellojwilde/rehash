var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./HeaderExplain.css');

var HeaderExplain = React.createClass({

  render: function() {
    return (
      <div className="HeaderExplain">
        <div className="container">
          <h2 className="HeaderExplain-heading">
            Rehash makes it easy to have group discussions with amazing  
            folks from around the world.
          </h2>
        </div>
      </div>
    );
  }

});

module.exports = HeaderExplain;