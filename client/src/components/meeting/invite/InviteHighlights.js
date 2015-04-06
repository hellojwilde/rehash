var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');


var InviteHighlights = React.createClass({

  propTypes: {
    highlights: React.PropTypes.arrayOf(React.PropTypes.shape({
      type: React.PropTypes.oneOf(['TOPIC', 'QUESTION']).isRequired,
      content: React.PropTypes.string.isRequired
    })).isRequired
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
                {highlight.content}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

});

module.exports = InviteHighlights;
