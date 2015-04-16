var {Actions} = require('flummox');

class AgendaActions extends Actions {
  constructor(registry, api) {
    super();

    this.registry = registry;
    this.api = api;
  }

  fetch(meetingKey) {
    return this.api.agendaFetch(meetingKey);
  }
}

module.exports = AgendaActions;