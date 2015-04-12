var {Actions} = require('flummox');

class AgendaActions extends Actions {
  constructor(registry, api) {
    super();

    this.registry = registry;
    this.api = api;
  }

  fetch(meetingId) {
    return this.api.agendaFetch(meetingId);
  }
}

module.exports = AgendaActions;