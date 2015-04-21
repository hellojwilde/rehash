var React = require('react');
var Avatar = require('components/common/Avatar');

require('./AgendaListQuestion.css');

var AgendaListQuestion = React.createClass({

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