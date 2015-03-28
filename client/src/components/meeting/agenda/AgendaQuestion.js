var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var AgendaQuestion = React.createClass({

  propTypes: {
    user: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      photoThumbnailUrl: React.PropTypes.string.isRequired
    }).isRequired,
    content: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      <div className="media">
        <div className="media-left">
          <img 
            src={this.props.user.photoThumbnailUrl}
            alt={`${this.props.user.name} (photo)`}
          />
        </div>

        <div className="media-body">
          <p>{this.props.content}</p>
        </div>
      </div>
    );
  }

});

module.exports = AgendaQuestion;