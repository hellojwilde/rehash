var React = require('react');
var DebriefBroadcast = require('components/DebriefBroadcast');
var DebriefPaidTopic = require('components/DebriefPaidTopic');
var TopicStore = require('stores/TopicStore');

require('3rdparty/bootstrap/css/bootstrap.css');
require('./DebriefPaid.css');

function getStoreState() {
  return {
    topics: TopicStore.get()
  };
}

var DebriefPaid = React.createClass({

  getInitialState: function() {
    console.log(getStoreState());

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
      <div className="DebriefPaid">
        <div className="DebriefAgendaHeader">
          <div className="pull-right DebriefAgendaHeader-online">
            <h3 className="DebriefAgendaHeader-online-title">Online</h3>

            <img 
              src="http://placehold.it/30x30" 
              className="img-thumbnail DebriefAgendaHeader-online-thumbnail"
            />
            <img 
              src="http://placehold.it/30x30" 
              className="img-thumbnail DebriefAgendaHeader-online-thumbnail"
            />
            <img 
              src="http://placehold.it/30x30" 
              className="img-thumbnail DebriefAgendaHeader-online-thumbnail"
            />
          </div>

          <h2 className="DebriefAgendaHeader-title">Agenda</h2>

          {this.state.topics.map(function(topic) {
            return (
              <DebriefPaidTopic 
                key={topic.topicID}
                topicID={topic.topicID}
                text={topic.text}
              />
            );
          })}
        </div>
      </div>
    );
  }

});

module.exports = DebriefPaid;