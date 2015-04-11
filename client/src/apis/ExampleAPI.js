var moment = require('moment');
var assign = require('object-assign');

var USERS = {
  0: {
    id: 0,
    photoUrl: 'http://placehold.it/400x300',
    photoThumbnailUrl: 'http://placehold.it/50x50',
    name: 'Jonathan Wilde',
    affiliation: 'Tufts University',
    bio: ''
  },
  4: {
    id: 4,
    photoUrl: 'http://placehold.it/400x300',
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
    host: USERS[4],
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

// Test implementation
var baseurl = '/api';

function handleAjaxError(emessage){
  console.log('AJAX ERROR: '+ emessage);
}

function sendAjaxRequest(reqData) {
  var result;
  $.ajax({
    url: baseurl,
    method: 'POST',
    data: reqData,
    dataType: 'json',
    success: function(data) {
      if (data.error == 'not found'){
        handleAjaxError(data.error);
      }
      result = data;
    },
    error: handleAjaxError
  });
  console.log('test');
  console.log(result);
  return result;
}

var ExampleAPI = {
  userFetch: function(userId) {
    var reqData = {
      format: 'json',
      userId: userId,
      request: 'userFetch'
    };
    var result = sendAjaxRequest(reqData);
    result.id = Number(result.id);
    console.log(result);
    return Promise.resolve(result);
    //return Promise.resolve(USERS[userId]);
  },

  exploreFetch: function() {
    return Promise.resolve(MEETINGS);
  },

  meetingFetch: function(meetingId) {
    var reqData = {
      format: 'json',
      meetingId: meetingId, 
      request: 'meetingFetch'
    };
    var result = sendAjaxRequest(reqData);
    // convert datetime string to moment
    console.log(result.start);
    result.start = moment(result.start);
    result.id = 0;

    console.log(result.start);
    return Promise.resolve(result);
  },

  meetingJoin: function(meetingId) {
    // need to pass in userId to add uses to attendees or hosts 
    // log on host, so need to update this function
    return Promise.resolve(meetingId);
  },

  // for datetime structure, think about saving on gae as string
  meetingCreate: function(meeting) {
    // dates are all saved as strings
    var mReqData = {
      format: 'json',
      request: 'meetingcreate',
      title: meeting.title, 
      description: meeting.description,
      start: meeting.start.format('YYYY-MM-DD HH:mm:ss Z'), 
      highlights: [],
      // note here the attendees shall be a list of numerical user ids to maintain atomicity 
      attendees: []
    };
    var meetingId = Number(sendAjaxRequest(mReqData).id);
    var aReqData = {
      format: 'json',
      request: 'agendacreate',
      meetingId: meetingId,
      topics: []
    };
    sendAjaxRequest(aReqData);

    return Promise.resolve(meetingId);
    // MEETINGS[meetingId] = assign(meeting, {
    //   id: meetingId,
    //   highlights: [],
    //   attendees: []
    // });
  },

  // await on decision
  agendaFetch: function(meetingId) {
    var reqData = {
      format: 'json',
      request: 'agendafetch',
      meetingId: meetingId
    }
    var result = sendAjaxRequest(reqData);
    result.topics = AGENDAS[0].topics;
    result.meetingId = Number(result.meetingId);
    console.log(result);
    return Promise.resolve(AGENDAS[0]);
  }
};

module.exports = ExampleAPI;



/*
  Notes: all ids are stored as string in the database for consistency, 
  need to recover if going to use them.  

  3. creat the logging system 

*/



