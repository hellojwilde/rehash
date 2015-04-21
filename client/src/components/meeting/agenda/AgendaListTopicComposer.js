var React = require('react');
var AgendaCardComposer = require('./AgendaCardComposer');
var IconButton = require('components/common/IconButton');

var AgendaListTopicComposer = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    meetingId: React.PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {
      isShowingCard: false 
    };
  },

  handleClick: function() {
    this.setState({isShowingCard: true});
  },

  handleComplete: function(content) {
    var agendaActions = this.context.flux.getActions('agenda');
    agendaActions.addTopic(this.props.meetingId, content)
      .then(() => this.setState({isShowingCard: false}))
  },

  render: function() {
    if (!this.state.isShowingCard) {
      return (
        <IconButton onClick={this.handleClick} className="btn-default" icon="plus">
          Create Topic
        </IconButton>
      );
    }

    return (
      <AgendaCardComposer 
        placeholder="Type a topic..." 
        onComplete={this.handleComplete}
      />
    );
  }

});

module.exports = AgendaListTopicComposer;