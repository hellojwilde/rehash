var moment = require('moment');

const EXAMPLE_USERS = {
  0: {
    id: 0,
    photoThumbnailUrl: 'http://placehold.it/50x50',
    name: 'Jonathan Wilde',
    affiliation: 'Tufts University'
  },
  4: {
    id: 4,
    photoUrl: 'http://placehold.it/200x170',
    name: 'Coleen Jose',
    bio: 
      'Coleen Jose is an American-Filipino multimedia journalist and \
      documentary photographer. She writes and shoots for publications in the \
      US and Philippines. She was a reporting fellow for E&E Publishing\'s \
      ClimateWire in Washington, DC.'
  },
  5: {
    id: 5,
    photoThumbnailUrl: 'http://placehold.it/50x50',
    name: 'Andreas Moser',
    affiliation: 'MIT Media Lab'
  },
  6: {
    id: 6,
    photoThumbnailUrl: 'http://placehold.it/50x50',
    name: 'Silya Mezyan',
    affiliation: 'Al Akhawayn University'
  },
  7: {
    id: 7,
    photoThumbnailUrl: 'http://placehold.it/50x50',
    name: 'Karina Wójcik',
    affiliation: 'Harvard School of Public Health'
  },
  8: {
    id: 8,
    photoThumbnailUrl: 'http://placehold.it/50x50',
    name: 'Biel Pérez',
    affiliation: 'University of Barcelona'
  }
};

const EXAMPLE_MEETINGS = {
  0: {
    id: 0,
    title: 'The Philippines’s Outsourcing Wave',
    description:
      'Coleen Jose will discuss the process of reporting on the rapid \
       increase in outsourcing operations in the Philippines and the impacts \
       on Philippine youth.',
    start: moment().subtract(10, 'm'),
    end: moment().add(1, 'h'),
    speaker: EXAMPLE_USERS[4],
    highlights: [
      {
        type: 'TOPIC',
        content: 'Challenges with competition for an outsourcing job'
      },
      {
        type: 'QUESTION',
        content: 'What sorts of ethical challenges were there in reporting?'
      },
      {
        type: 'QUESTION',
        content: 'What changes need to happen to the outsourcing industry?'
      }
    ],
    attendees: [
      EXAMPLE_USERS[5], 
      EXAMPLE_USERS[6],
      EXAMPLE_USERS[7],
      EXAMPLE_USERS[8]
    ]
  }
};

const EXAMPLE_AGENDAS = {
  0: {
    0: {

    },
    1: {

    },
    2: {

    }
  }
}

class ExampleAPI {
  constructor(flux) {
    this.flux = flux;
  }

  // TODO: Figure out a credential to support here.
  currentUserLogin() {
    return Promise.resolve({
      user: EXAMPLE_USERS[0],
      joinedMeetingIds: []
    });
  }

  currentUserLogout() {
    return Promise.resolve({});
  }

  userFetch(userId) {
    return Promise.resolve(EXAMPLE_USERS[userId]);
  }

  meetingFetch(meetingId) {
    return Promise.resolve(EXAMPLE_MEETINGS[meetingId]);
  }

  meetingJoin(meetingId) {
    return Promise.resolve(meetingId);
  }

  agendaFetch(meetingId) {
    return Promise.resolve(EXAMPLE_AGENDAS[meetingId]);
  }

  createAgendaTopic(meetingId) {

  }

  createAgendaQuestion(meetingId, topicId) {

  }
}

module.exports = ExampleAPI;
