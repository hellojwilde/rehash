var _ = require('lodash');
var moment = require('moment');

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
const BASE_URL = '/api';

function handleAjaxError(emessage, callback){
  console.log('AJAX ERROR: '+ emessage);
  callback(emessage);
}

function sendAjaxRequest(reqData) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: BASE_URL,
      method: 'POST',
      data: reqData,
      dataType: 'json',
      success: function(data) {
        if (data.error == 'not found') {
          handleAjaxError(data.error, reject);
          return;
        }
        resolve(data);
      },
      error: handleAjaxError
    });
  });
}

var ExampleAPI = {

  /**
   * Given a user id, this fetches a user object. 
   * Useful for profile popups and pages.
   * 
   * @param  {string} userId Unlike meeting ids, the userId is a string.
   * @return {Promise}       Resolves to the user object.
   */
  userFetch: function(userId) {
    var reqData = {
      format: 'json',
      userId: userId,
      request: 'userFetch'
    };
    return sendAjaxRequest(reqData);
  },

  /**
   * On the homepage (i.e. the explore UI), we have a set of upcoming meetings.
   * This fetches the set of meetings to display for that.
   * 
   * @return {Promise} Resolves to an array of meeting objects.
   */
  exploreFetch: function() {
    // TODO: Make request against remote endpoint.
    var reqData = {
      format: 'json',
      userId: userId,
      request: 'exploreFetch'
    };

    return sendAjaxRequest(reqData);
    // return Promise.resolve(_.values(MEETINGS));
  },

  /**
   * If the user jumps to a standalone meeting page (e.g. from a tweet),
   * we won't have the meeting already cached from the explore page.
   * This fetches a single specific meeting to display in the app.
   * 
   * @param  {number} meetingId The id of the meeting to fetch.
   * @return {Promise}          Resolves to a meeting object.
   */
  meetingFetch: function(meetingId) {
    var reqData = {
      format: 'json',
      meetingId: meetingId, 
      request: 'meetingFetch'
    };
    
    return sendAjaxRequest(reqData)
      .then((result) => {
        // TODO: make sure we're including a real result id here.
        // convert datetime string to moment

        // double check
        result.start = moment(result.start);
        result.id = Number(result.id);
        return result;
      });

  },

  /**
   * "Joining" is an action that indicates that the user somehow "attended"
   * a given meeting, including by:
   *
   *  - By being marked as the host for an event.
   *  - Clicking the "subscribe" button before the event starts.
   *  - Viewing the meeting while logged in.
   *
   * This is kind of a funky API call, in that it's associated with a user id.
   * If we call this over ajax, the server will have access to the cookies that
   * we're using to maintain the user's session.
   *
   * If the server uses something like GAE sessions to maintain the current 
   * sign-in status...
   *
   *    <https://github.com/dound/gae-sessions>
   *
   * ...we can have the server pull the user ID from that session information.
   * There's no need to provide a user ID here.
   * 
   * @param  {number} meetingId The id of the meeting to mark the current user 
   *                            as joined to.
   * @return {Promise}          Resolves to sort of message indicating that the
   *                            join attempt didn't entirely fail.
   */
  // Need to make sure the user has signed in before this is called
  meetingJoin: function(meetingId) {
    var reqData = {
      format: 'json',
      meetingId: meetingId, 
      request: 'meetingjoin'
    };
    return sendAjaxRequest(reqData);
  },

  /**
   * When we create the meeting initially, we want to force the user to set
   * a title and start time, and encourage them to set description and cover
   * photo so that we have a nice-looking, sortable tile to display in the feed
   * immediately.
   *
   * This should set up a blank agenda, along with an attendee list containing 
   * the user that created the meeting.
   * 
   * @param  {object} meeting  A meeting object without an id.
   * @return {Promise}         Resolves to the id that the meeting was saved as.
   */
  meetingCreate: function(meeting) {
    // for datetime structure, think about saving on gae as string
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

    var aReqData = {
      format: 'json',
      request: 'agendacreate',
      meetingId: meetingId,
      topics: []
    };
    return sendAjaxRequest(mReqData)
      .then((result) => {
        var meetingId = Number(result.id);
        return sendAjaxRequest(aReqData)
          .then(() => meetingId)
      });
  },



  //
  //  Suggested methods which may aid front end work; NOT YET IMPLEMENTED ON FRONT END
  //

  /**
   * @param  {int} meetingId   
   *         {object} topics   Array of topics
   * @return {Promise}         Resolves to the id that the topics are added to
   */
  agendaAdd: function(meetingId, topics){
    var reqData = {
      format: 'json',
      request: 'agendaAdd',
      meetingId: meetingId, 
      topics: topics
    };
    return sendAjaxRequest(reqData);
  }

  /**
   * @param  {int} meetingId   
   * @return {Promise}         Resolves to the array of topics 
   */
  agendaFetch: function(meetingId) {
    var reqData = {
      format: 'json',
      request: 'agendafetch',
      meetingId: meetingId
    }
    var result = sendAjaxRequest(reqData);
    result.topics = AGENDAS[0].topics;
    result['meetingId'] = Number(result['meetingId']);
    console.log(result);
    return Promise.resolve(AGENDAS[0]);
  }

  /**
   * @param  {int} meetingId   
   *         {object} question Includes string of question and timestamp
   * @return {Promise}         Resolves to the dict containing question id (int or string?)
   */
  questionAdd: function(meetingId, question){
    var reqData = {
      format: 'json',
      request: 'questionAdd',
      meetingId: meetingId, 
      question: question
    };
    return sendAjaxRequest(reqData)
      .then((result) => {
        result.id = Number(result.id);
        return result;
      });
  }

  /**
   * @param  {int} meetingId   
   * @return {Promise}         Resolves to the array of questions on a meeting
   */
  questionFetch: function(meetingId) {
    var reqData = {
      format: 'json',
      request: 'questionfetch',
      meetingId: meetingId
    }
    var result = sendAjaxRequest(reqData);
    result.topics = AGENDAS[0].topics;
    result['meetingId'] = Number(result['meetingId']);
    console.log(result);
    return Promise.resolve(result);
  }

  /**
   * @param  {int} questionId   
   *         {object} question Includes string of answer and timestamp
   * @return {Promise}         Resolves to the id that the questions are added to
   */
  answerAdd: function(questionId, answer){
    var reqData = {
      format: 'json',
      request: 'questionAdd', 
      questionId: questionId, 
      answer: answer
    };
    return sendAjaxRequest(reqData)
      .then((result) => {
        result.id = Number(result.id);
        return result;
      });
  }

  /**
   * @param  {int} meetingId   
   * @return {Promise}         Resolves to the array of questions on a meeting
   */
  answerFetch: function(questionId) {
    var reqData = {
      format: 'json',
      request: 'questionfetch',
      questionId: questionId
    }
    var result = sendAjaxRequest(reqData);
    result.topics = AGENDAS[0].topics;
    result['questionId'] = Number(result['questionId']);
    console.log(result);
    return Promise.resolve(result);
  }
};

module.exports = ExampleAPI;





