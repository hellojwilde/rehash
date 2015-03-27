var moment = require('moment');

var USERS = {
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

var MEETING_ID = 0;

var MEETINGS = {
  0: {
    id: 0,
    title: 'The Philippines’s Outsourcing Wave',
    description:
      'Coleen Jose will discuss the process of reporting on the rapid \
       increase in outsourcing operations in the Philippines and the impacts \
       on Philippine youth.',
    start: moment().subtract(10, 'm'),
    speaker: USERS[4],
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
      USERS[5], 
      USERS[6],
      USERS[7],
      USERS[8]
    ]
  }
};

var AGENDAS = {
  0: {
    meetingId: 0,
    topics: [
      {
        id: 0,
        content: 
          'Challenges with competition for an outsourcing job and the role of \
           brains and beauty in hiring decisions',
        questions: []
      },
      {
        id: 1,
        content:
          'Exploring the reporting process for the project and the challenges \
           faced during production',
        questions: []
      },
      {
        id: 2,
        content:
          'Exploring the reporting process for the project and the challenges \
           faced during production',
        questions: []
      }
    ]
  }
}

var ExampleAPI = {
  // TODO: Figure out a credential to support here.
  currentUserLogin: function() {
    return Promise.resolve({
      user: USERS[0],
      joinedMeetingIds: []
    });
  },

  currentUserLogout: function() {
    return Promise.resolve({});
  },

  userFetch: function(userId) {
    return Promise.resolve(USERS[userId]);
  },

  meetingFetch: function(meetingId) {
    return Promise.resolve(MEETINGS[meetingId]);
  },

  meetingJoin: function(meetingId) {
    return Promise.resolve(meetingId);
  },

  meetingCreate: function(meeting) {
    var meetingId = ++MEETING_ID;

    MEETINGS[meetingId] = Object.assign(meeting, {id: meetingId}); 
    AGENDAS[meetingId] = {
      meetingId: meetingId,
      topics: []
    };

    console.log(MEETINGS, AGENDAS)

    return Promise.resolve(meetingId);
  },

  agendaFetch: function(meetingId) {
    return Promise.resolve(AGENDAS[meetingId]);
  }
};

module.exports = ExampleAPI;
