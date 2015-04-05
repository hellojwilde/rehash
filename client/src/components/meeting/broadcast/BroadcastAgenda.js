var AgendaTopic = require('components/meeting/broadcast/BroadcastAgendaTopic');
var React = require('react');

var Agenda = React.createClass({

  propTypes: {
    meetingId: React.PropTypes.number.isRequired,
    topics: React.PropTypes.array.isRequired
  },

  render: function() {
    return (
      <div className="Agenda">
        {this.props.topics.map((topic) => {
          var {id, content} = topic;

          return (
            <AgendaTopic 
              key={id} 
              meetingId={this.props.meetingId} 
              topicId={id} 
              content={content}
            />
          );
        })}
      </div>
    );
  }

});

module.exports = Agenda;