var React = require('react/addons');
var QuestionActionCreators = require('actions/QuestionActionCreators');

var LinkedStateMixin = React.addons.LinkedStateMixin;

var DebriefQuestionComposer = React.createClass({

  mixins: [LinkedStateMixin],

  propTypes: {
    topicID: React.PropTypes.number
  },

  getInitialState: function() {
    return {
      text: '' 
    };
  },

  handleKeyPress: function(e) {
    if (e.keyCode === 13 && this.state.text.length > 5) {
      QuestionActionCreators.createQuestion(
        this.props.topicID,
        this.state.text
      );
      this.setState({text: ''});
    }
  },

  render: function() {
    return (
      <div className="media">
        <div className="media-body">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Type a question..."
            valueLink={this.linkState('text')}
            onKeyUp={this.handleKeyPress}
          />
        </div>
      </div>
    );
  }

});

module.exports = DebriefQuestionComposer;