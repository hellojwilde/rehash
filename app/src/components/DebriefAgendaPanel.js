var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var DebriefAgendaPanel = React.createClass({

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          Agenda Highlights
        </div>

        <ul className="list-group">
          <li className="list-group-item">
            Challenges with data analysis at Forrst
          </li>
          <li className="list-group-item">
            What are the most common pitfalls with data-driven policy?
          </li>
          <li className="list-group-item">
            Why is enabling regular people so important?
          </li>
        </ul>
      </div>
    );
  }

});

module.exports = DebriefAgendaPanel;