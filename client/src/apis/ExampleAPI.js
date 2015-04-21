var _ = require('lodash');
var moment = require('moment');

// Test implementation
const BASE_URL = '/api';

function handleAjaxError(emessage, callback){
  console.log('AJAX ERROR: '+ emessage);
  typeof callback === 'function' && callback(emessage);
}

function sendAjaxRequest(reqData) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: BASE_URL,
      method: 'POST',
      data: reqData,
      dataType: 'json',
      success: function(data) {
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
    var reqData = {
      format: 'json',
      request: 'exploreFetch'
    };

    return sendAjaxRequest(reqData)
  },

  /**
   * If the user jumps to a standalone meeting page (e.g. from a tweet),
   * we won't have the meeting already cached from the explore page.
   * This fetches a single specific meeting to display in the app.
   * 
   * @param  {number} meetingId The id of the meeting to fetch.
   * @return {Promise}           Resolves to a meeting object.
   */
  meetingFetch: function(meetingId) {
    var reqData = {
      format: 'json',
      id: meetingId, 
      request: 'meetingFetch'
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
   * @return {Promise}         Resolves to an object of shape {id: KEY} 
   *                           that the meeting was saved as.
   */
  meetingCreate: function(meeting) {
    // for datetime structure, think about saving on gae as string
    // dates are all saved as strings
    return sendAjaxRequest({
      format: 'json',
      request: 'meetingCreate',
      title: meeting.title, 
      description: meeting.description,
      start: moment.utc(meeting.start).toISOString()
    });
  },

  meetingUpdate: function(meetingId, meeting) {
    return sendAjaxRequest({
      format: 'json',
      request: 'meetingUpdate',
      id: meetingId,
      title: meeting.title,
      description: meeting.description,
      start: moment.utc(meeting.start).toISOString()
    });
  },

  // Need to make sure the user has signed in before this is called
  meetingSubscribe: function(meetingId) {
    return sendAjaxRequest({
      format: 'json',
      id: meetingId, 
      request: 'meetingsubscribe'
    });
  },

  meetingOpen: function(connectedUserId, meetingId) {
    return sendAjaxRequest({
      format: 'json',
      id: meetingId,
      connectedUserId: connectedUserId,
      request: 'meetingopen'
    });
  },

  meetingClose: function(connectedUserId, meetingId) {
    return sendAjaxRequest({
      format: 'json',
      id: meetingId,
      connectedUserId: connectedUserId,
      request: 'meetingclose'
    });
  },

  /**
   * @param  {int} meetingId   
   * @return {Promise}         Resolves to the array of topics 
   */
  agendaFetch: function(meetingId) {
    return sendAjaxRequest({
      format: 'json',
      request: 'agendafetch',
      meetingId: meetingId
    });
  },

  /**
   * @param  {int} meetingId   
   *         {object} topics   Array of topics
   * @return {Promise}         Resolves to the id that the topic was added as
   */
  agendaAddTopic: function(meetingId, content){
    return sendAjaxRequest({
      format: 'json',
      request: 'agendaAddTopic',
      meetingId: meetingId, 
      content: content
    });
  },

  agendaAddQuestion: function(meetingId, topicId, content) {
    return sendAjaxRequest({
      format: 'json',
      request: 'agendaAddQuestion',
      meetingId: meetingId, 
      topicId: topicId,
      content: content
    });
  },

  broadcastFetch: function(meetingId) {
    return sendAjaxRequest({
      format: 'json',
      meetingId: meetingId,
      request: 'broadcastFetch'
    });
  },

  broadcastStart: function(connectedUserId, meetingId) {
    return sendAjaxRequest({
      format: 'json',
      meetingId: meetingId,
      connectedUserId: connectedUserId,
      request: 'broadcastStart'
    });
  },

  broadcastEnd: function(meetingId) {
    return sendAjaxRequest({
      format: 'json',
      meetingId: meetingId,
      request: 'broadcastEnd'
    });
  },

  webRTCSendMessage: function(connectedUserId, to, message) {
    return sendAjaxRequest({
      format: 'json',
      to: to,
      request: 'webRTCSendMessage',
      connectedUserId: connectedUserId,
      message: JSON.stringify(message)
    });
<<<<<<< HEAD
=======
  },

  uploadSendMessage: function(formData) {
    return $.ajax({
          type: 'POST',
          url: '/upload',
          data: formData,
          processData: false,
          contentType: false
      }).done(function(data) {
        console.log('Firstframe files successfully uploaded');
        // may want ot suspend user action during video upload
      }).fail(function(e){
        console.log('Firstframe files fail to upload');
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
    return sendAjaxRequest({
      format: 'json',
      request: 'agendaAdd',
      meetingId: meetingId, 
      topics: topics
    });
  },

  /**
   * @param  {int} meetingId   
   * @return {Promise}         Resolves to the array of topics 
   */
  agendaFetch: function(meetingId) {
    return sendAjaxRequest({
      format: 'json',
      request: 'agendafetch',
      meetingId: meetingId
    });
  },

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
  },

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
>>>>>>> 20dfc53cee92b99aec69c2d83c8cc8a1084dcda9
  }
};

module.exports = ExampleAPI;
