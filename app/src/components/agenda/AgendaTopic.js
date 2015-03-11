var AgendaQuestion = require('components/agenda/AgendaQuestion');
var AgendaQuestionComposer = require('components/agenda/AgendaQuestionComposer');
var QuestionStore = require('stores/QuestionStore');
var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

function getStoreState(topicID) {
  return {
    questions: QuestionStore.getAllForTopic(topicID)
  };
}

var AgendaTopic = React.createClass({

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
            return <AgendaQuestion key={idx} text={question.text} />;
          })}

          <AgendaQuestionComposer topicID={this.props.topicID}/>
        </div>
      </div>
    );
  }

});

module.exports = AgendaTopic;