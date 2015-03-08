var React = require('react');
var {RouteHandler} = require('react-router');
var DebriefHeader = require('components/DebriefHeader');
var Footer = require('components/Footer');

var moment = require('moment');

require('./Debrief.css');

var Debrief = React.createClass({

  render: function() {
    return (
      <div className="Debrief">
        <DebriefHeader 
          title="Experts Rarely Make Policy"
          start={moment().subtract(10, 'm')}
          end={moment().add(1, 'h')}
        />

        <div className="Debrief-main">
          <RouteHandler/>
        </div>

        <Footer />
      </div>
    );
  }

});

module.exports = Debrief;