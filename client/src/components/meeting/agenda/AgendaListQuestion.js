var React = require('react');
var Avatar = require('components/common/Avatar');

var userPropType = require('types/userPropType');

require('./AgendaListQuestion.css');

var AgendaListQuestion = React.createClass({

  propTypes: {
    content: React.PropTypes.string.isRequired,
    user: userPropType.isRequired
  },

  render: function() {
    return (
      <div className="AgendaListQuestion">
        <Avatar user={this.props.user}/>
        <div className="AgendaListQuestion-content">
          <p>{this.props.content}</p>
        </div>
      </div>
    );
  }

});

module.exports = AgendaListQuestion;