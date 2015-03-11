var React = require('react');
var QuestionStore = require('stores/QuestionStore');
var DebriefQuestion = require('components/DebriefQuestion');
var DebriefQuestionComposer = require('components/DebriefQuestionComposer');

function getStoreState(topicID) {
  return {
    questions: QuestionStore.getAllForTopic(topicID)
  };
}

var DebriefPaidTopic = React.createClass({

  propTypes: {
    topicID: React.PropTypes.number.isRequired,
    text: React.PropTypes.string
  },

  getInitialState: function() {
    return getStoreState(this.props.topicID);
  },

  componentDidMount: function() {
    QuestionStore.on(QuestionStore.CHANGE_EVENT, this.handleStoreChange);
  },

  componentWillUnmount: function() {
    QuestionStore.off(QuestionStore.CHANGE_EVENT, this.handleStoreChange);
  },

  handleStoreChange: function() {
    this.setState(getStoreState(this.props.topicID));
  },

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <p className="lead">
            {this.props.text}
          </p>

          <h4>Questions</h4>

          {this.state.questions.map(function(question, idx) {
            return <DebriefQuestion key={idx} text={question.text} />;
          })}

          <DebriefQuestionComposer topicID={this.props.topicID}/>
        </div>
      </div>
    );
  }

});

module.exports = DebriefPaidTopic;