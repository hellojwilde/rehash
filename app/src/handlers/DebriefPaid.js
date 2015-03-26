var React = require('react');
var Agenda = require('components/agenda/Agenda');

var DebriefPaid = React.createClass({
  render: function() {
    return (
      <div className="DebriefPaid">
        <Agenda/>
      </div>
    );
  }

});

module.exports = DebriefPaid;