var React = require('react');
var ParagraphOverview = require('components/overview/ParagraphOverview');
var AgendaOverview = require('components/overview/AgendaOverview');
var AttendeesOverview = require('components/overview/AttendeesOverview');

var DebriefUnpaid = React.createClass({

  render: function() {
    return (
      <div className="DebriefUnpaid">
        <ParagraphOverview/>
        <AgendaOverview/>
        <AttendeesOverview/>
      </div>
    );
  }

});

module.exports = DebriefUnpaid;