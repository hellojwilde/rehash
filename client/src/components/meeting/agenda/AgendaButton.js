var React = require('react');
var AgendaModal = require('modals/AgendaModal');

var AgendaButton = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    meetingKey: React.PropTypes.string.isRequired
  },

  handleClick: function() {
    this.context.flux.getActions('modal')
      .push(AgendaModal, {meetingKey: this.props.meetingKey});
  },

  render: function() {
    return (
      <button 
        className="btn btn-sm btn-default"
        onClick={this.handleClick}>
        Agenda
      </button>
    );
  }

});

module.exports = AgendaButton;