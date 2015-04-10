var React = require('react');
var Header = require('components/explore/Header');
var Footer = require('components/explore/Footer');

var ExploreHandler = React.createClass({

  render: function() {
    return (
      <div className="ExploreHandler">
        <Header/>
        <Footer/>
      </div>
    );
  }

});

module.exports = ExploreHandler;