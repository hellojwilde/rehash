var {Store} = require('flummox');

class AgendaStore extends Store { 
  constructor(flux) {
    super();

    var agendaActionIds = flux.getActionIds('agenda');

    this.register(agendaActionIds.fetch, this.handleAgendaFetch);

    this.state = {}
  }

  getByMeetingId(meetingId) {
    return this.state[meetingId];
  }

  handleAgendaFetch(agenda) {
    this.setState({
      [agenda.meetingId]: agenda
    });
  }
}

module.exports = AgendaStore;