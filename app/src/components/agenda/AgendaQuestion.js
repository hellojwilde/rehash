var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var AgendaQuestion = React.createClass({

  propTypes: {
    text: React.PropTypes.string
  },

  render: function() {
    return (
      <div className="media">
        <div className="media-left">
          <img src="http://placehold.it/50x50"/>
        </div>

        <div className="media-body">
          <p>{this.props.text}</p>
        </div>
      </div>
    );
  }

});

module.exports = AgendaQuestion;