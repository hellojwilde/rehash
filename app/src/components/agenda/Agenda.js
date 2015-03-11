var AgendaOnline = require('components/agenda/AgendaOnline');
var AgendaTopic = require('components/agenda/AgendaTopic');
var React = require('react');
var TopicStore = require('stores/TopicStore');

require('./Agenda.css');

function getStoreState() {
  return {
    topics: TopicStore.get()
  };
}

var Agenda = React.createClass({

  getInitialState: function() {
    return getStoreState();
  },

  componentDidMount: function() {
    TopicStore.on(TopicStore.CHANGE_EVENT, this.handleStoreChange);
  },

  componentWillUnmount: function() {
    TopicStore.off(TopicStore.CHANGE_EVENT, this.handleStoreChange);
  },

  handleStoreChange: function() {
    this.setState(getStoreState());
  },

  render: function() {
    return (
      <div className="Agenda">
        <div className="Agenda-header">
          <AgendaOnline/>
          <h2 className="Agenda-header-title">Agenda</h2>
        </div>

        {this.state.topics.map(function(topic) {
          return (
            <AgendaTopic 
              key={topic.topicID}
              topicID={topic.topicID}
              text={topic.text}
            />
          );
        })}
      </div>
    );
  }

});

module.exports = Agenda;