var {Actions} = require('flummox');

class AgendaActions extends Actions {
  constructor(flux, api) {
    super();

    this.flux = flux;
    this.api = api;
  }

  fetch(meetingId) {
    return this.api.agendaFetch(meetingId);
  }
}

module.exports = AgendaActions;