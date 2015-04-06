var AgendaQuestion = require('components/meeting/broadcast/BroadcastAgendaQuestion');
var AgendaQuestionComposer = require('components/meeting/broadcast/BroadcastAgendaQuestionComposer');
var React = require('react');

require('3rdparty/bootstrap/css/bootstrap.css');

var AgendaTopic = React.createClass({

  propTypes: {
    meetingId: React.PropTypes.number.isRequired,
    topicId: React.PropTypes.number.isRequired,
    content: React.PropTypes.string
  },

  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <p className="lead">
            {this.props.content}
          </p>

          <h4>Questions</h4>

          {/*this.state.questions.map(function(question, idx) {
            return (
              <AgendaQuestion 
                key={idx} text={question.text}
              />
            );
          })*/}

          <AgendaQuestionComposer
            meetingId={this.props.meetingId} 
            topicId={this.props.topicId}
          />
        </div>
      </div>
    );
  }

});

module.exports = AgendaTopic;