var React = require('react');
var {RouteHandler} = require('react-router');
var DebriefHeader = require('components/DebriefHeader');

var moment = require('moment');

var Debrief = React.createClass({

  render: function() {
    return (
      <div className="Debrief">
        <DebriefHeader 
          title="Experts Rarely Make Policy"
          start={moment().subtract(10, 'm')}
          end={moment().add(1, 'h')}
        />
        <RouteHandler/>
      </div>
    );
  }

});

module.exports = Debrief;