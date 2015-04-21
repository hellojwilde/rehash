var React = require('react');

var ensureCurrentUser = require('helpers/ensureCurrentUser');

const KEY_RETURN = 13;

var AgendaListQuestionComposer = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    meetingId: React.PropTypes.number.isRequired,
    topicId: React.PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {
      value: ''
    };
  },

  handleChange: function(e) {
    this.setState({value: e.target.value});
  },

  handleKeyDown: function(e) {
    if (e.keyCode !== KEY_RETURN || this.state.value.length === 0) {
      return;
    }
    
    e.preventDefault();

    ensureCurrentUser(
      this.context.flux, 
      'You must be logged in to add a question.'
    )
      .then(() => {
        var agendaActions = this.context.flux.getActions('agenda');
        var {meetingId, topicId} = this.props;

        agendaActions.addQuestion(meetingId, topicId, this.state.value)
          .then(() => this.setState({value: ''}));
      });
  },

  render: function() {
    return (
      <input 
        className="form-control" 
        placeholder="Add your question..."
        type="text"
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        value={this.state.value}
      />
    );
  }

});

module.exports = AgendaListQuestionComposer;