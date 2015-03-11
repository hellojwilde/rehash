var React = require('react');
var {RouteHandler} = require('react-router');
var DebriefHeader = require('components/DebriefHeader');
var SpeakerOverview = require('components/overview/SpeakerOverview');
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

        <div className="container Debrief-container">
          <div className="row">
            <div className="col-sm-5 col-md-4">
              <SpeakerOverview/>
            </div>

            <div className="col-sm-7 col-md-8">
              <RouteHandler/>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

});

module.exports = Debrief;