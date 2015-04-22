var React = require('react/addons');
var AgendaCardComposer = require('./AgendaCardComposer');
var IconButton = require('components/common/IconButton');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

require('./AgendaListTopicComposer.css');

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

  handleTextareaRef: function(textarea) {
    if (textarea) {
      setTimeout(() => textarea.getDOMNode().focus(), 500);
    }
  },

  render: function() {
    var child = null;

    if (!this.state.isShowingCard) {
      child = (
        <IconButton
          key="button"
          onClick={this.handleClick} 
          className="btn-default btn-lg" 
          icon="plus">
          Create Topic
        </IconButton>
      );
    } else {
      child = (
        <AgendaCardComposer 
          textareaRef={this.handleTextareaRef}
          key="composer"
          placeholder="Type a topic..." 
          onComplete={this.handleComplete}
        />
      );
    }

    return (
      <ReactCSSTransitionGroup 
        className="AgendaListTopicComposer"
        transitionLeave={false}
        transitionName="AgendaListTopicComposer--transition">
        {child}
      </ReactCSSTransitionGroup>
    );
  }

});

module.exports = AgendaListTopicComposer;