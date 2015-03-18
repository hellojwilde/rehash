var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

const DEMO_HIGHLIGHTS = [
  {
    type: 'TOPIC',
    content: 'Challenges with competition for an outsourcing job'
  },
  {
    type: 'QUESTION',
    content: 'What sorts of ethical challenges were there in reporting on this?'
  },
  {
    type: 'QUESTION',
    content: 'What changes need to happen to the outsourcing industry?'
  }
];

var OverviewHighlights = React.createClass({

  propTypes: {
    highlights: React.PropTypes.arrayOf(React.PropTypes.shape({
      type: React.PropTypes.oneOf(['TOPIC', 'QUESTION']).isRequired,
      content: React.PropTypes.string.isRequired
    }))
  },

  getDefaultProps: function() {
    return {
      highlights: DEMO_HIGHLIGHTS
    };
  },

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          Agenda Highlights
        </div>

        <ul className="list-group">
          {this.props.highlights.map(function(highlight, idx) {
            return (
              <li key={idx} className="list-group-item">
                {highlight}
              </li>
            );
          });
        </ul>
      </div>
    );
  }

});

module.exports = OverviewHighlights;
