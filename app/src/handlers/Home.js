var React = require('react');
var {Link} = require('react-router');
var Header = require('components/Header');
var Logo = require('components/Logo');
var Footer = require('components/Footer');

require('./Home.css');
require('3rdparty/bootstrap/css/bootstrap.css');

var Home = React.createClass({

  render: function() {
    return (
      <div className="Home">
        <div className="jumbotron Home-jumbotron">
          <div className="container">
            <div className="row">
              <div className="col-md-10">
                <Logo className="Home-logo" />
                <h1 className="Home-tagline">
                  A better way to host talks and Q&As online.
                </h1>
                <Link to="unpaid" className="btn btn-lg btn-success Home-start">
                  Get Started{' '}
                  <span className="glyphicon glyphicon-arrow-right"/>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <h2>Happening Now and Soon</h2>
        </div>

        <Footer/>
      </div>
    );
  }

});

module.exports = Home;