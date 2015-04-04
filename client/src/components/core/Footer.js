var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./Footer.css');

var Footer = React.createClass({

  render: function() {
    return (
      <footer className="Footer">
        <div className="container">
          <p className="text-muted">
            A research project of Hao Wan and Jonathan Wilde.
          </p>
        </div>
      </footer>
    );
  }

});

module.exports = Footer;