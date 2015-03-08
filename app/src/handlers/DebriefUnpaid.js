var React = require('react');
var DebriefDescriptionPanel = require('components/DebriefDescriptionPanel');
var DebriefAgendaPanel = require('components/DebriefAgendaPanel');
var DebriefAttendeesPanel = require('components/DebriefAttendeesPanel');

var DebriefUnpaid = React.createClass({

  render: function() {
    return (
      <div className="DebriefUnpaid">
        <DebriefDescriptionPanel/>
        <DebriefAgendaPanel/>
        <DebriefAttendeesPanel/>
      </div>
    );
  }

});

module.exports = DebriefUnpaid;