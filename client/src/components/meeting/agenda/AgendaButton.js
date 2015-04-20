var React = require('react');
var AgendaModal = require('modals/AgendaModal');

var AgendaButton = React.createClass({

  contextTypes: {
    flux: React.PropTypes.object.isRequired
  },

  propTypes: {
    meetingId: React.PropTypes.number.isRequired
  },

  handleClick: function() {
    this.context.flux.getActions('modal')
      .push(AgendaModal, {meetingId: this.props.meetingId});
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