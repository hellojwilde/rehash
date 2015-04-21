var React = require('react');
var AgendaListQuestionComposer = require('./AgendaListQuestionComposer');
var AgendaListQuestion = require('./AgendaListQuestion');
var FluxComponent = require('flummox/component');

var meetingRelationPropType = require('types/meetingRelationPropType');

require('./AgendaListTopic.css');

var AgendaListTopic = React.createClass({

  propTypes: {
    meetingRelation: meetingRelationPropType.isRequired,
    meetingId: React.PropTypes.number.isRequired,
    id: React.PropTypes.number.isRequired,
    content: React.PropTypes.string
  },

  render: function() {
    return (
      <div className="AgendaListTopic panel panel-default">
        <div className="panel-body">
          <p>{this.props.content}</p>
        </div>

        <FluxComponent 
          connectToStores={['question']}
          stateGetter={([questionStore]) => ({
            questions: questionStore.getByTopicId(this.props.id)
          })}
          render={({questions}) => (
            <ul className="list-group">
              {questions.map((question, idx) => (
                <li className="list-group-item" key={idx}>
                  <AgendaListQuestion {...question} />
                </li>
              ))}

              <li className="list-group-item">
                <AgendaListQuestionComposer 
                  meetingId={this.props.meetingId} 
                  topicId={this.props.id}
                />
              </li>
            </ul>
          )}
        />
      </div>
    );
  }

});

module.exports = AgendaListTopic;