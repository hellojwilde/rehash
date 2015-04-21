var React = require('react');
var AgendaListTopicComposer = require('./AgendaListTopicComposer');
var AgendaListTopic = require('./AgendaListTopic');

var meetingRelationPropType = require('types/meetingRelationPropType');

require('./AgendaList.css');

var AgendaList = React.createClass({

  propTypes: {
    meetingRelation: meetingRelationPropType.isRequired,
    meetingId: React.PropTypes.number.isRequired,
    topics: React.PropTypes.array.isRequired
  },


  render: function() {
    var {topics, meetingRelation} = this.props;

    if (topics.length === 0) {
      return (
        <div className="AgendaList AgendaList--empty">
          <div>
            <p><span className="glyphicon glyphicon-list AgendaList--empty-glyphicon"/></p>
            <p>{'The host hasn\'t added an agenda yet.'}</p>
            <p>{'Tell them to get on that.'}</p>
            <p className="AgendaList--empty-composer">
              {meetingRelation.isHost && (
                <AgendaListTopicComposer
                  meetingId={this.props.meetingId}
                />
              )}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="AgendaList">
        {topics.map(function(topic, idx) {
          return (
            <AgendaListTopic 
              {...topic} 
              meetingRelation={meetingRelation} 
              key={idx} 
            />
          );
        })}

        <p className="AgendaList-composer">
          {meetingRelation.isHost && (
            <AgendaListTopicComposer
              meetingId={this.props.meetingId}
            />
          )}
        </p>
      </div>
    );
  }

});

module.exports = AgendaList;