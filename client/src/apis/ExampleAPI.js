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
  connectedUserFetch: function(connectedUserId) {
    return sendAjaxRequest({
      request: 'connectedUserFetch'
    });
  },

  /**
   * Given a user id, this fetches a user object. 
   * Useful for profile popups and pages.
   * 
   * @param  {string} userId Unlike meeting ids, the userId is a string.
   * @return {Promise}       Resolves to the user object.
   */
  userFetch: function(userId) {
    return sendAjaxRequest({
      request: 'userFetch',
      userId: userId
    });
  },

  /**
   * On the homepage (i.e. the explore UI), we have a set of upcoming meetings.
   * This fetches the set of meetings to display for that.
   * 
   * @return {Promise} Resolves to an array of meeting objects.
   */
  exploreFetch: function() {
    return sendAjaxRequest({
      request: 'exploreFetch'
    });
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
    return sendAjaxRequest({
      request: 'meetingFetch',
      id: meetingId
    });
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
  meetingCreate: function(connectedUserId, meeting) {
    // for datetime structure, think about saving on gae as string
    // dates are all saved as strings
    return sendAjaxRequest({
      request: 'meetingCreate',
      connectedUserId: connectedUserId,
      title: meeting.title, 
      description: meeting.description,
      start: moment.utc(meeting.start).toISOString()
    });
  },

  meetingUpdate: function(connectedUserId, meetingId, meeting) {
    return sendAjaxRequest({
      request: 'meetingUpdate',
      connectedUserId: connectedUserId,
      id: meetingId,
      title: meeting.title,
      description: meeting.description,
      start: moment.utc(meeting.start).toISOString()
    });
  },

  // Need to make sure the user has signed in before this is called
  meetingSubscribe: function(connectedUserId, meetingId) {
    return sendAjaxRequest({
      id: meetingId, 
      connectedUserId: connectedUserId,
      request: 'meetingsubscribe'
    });
  },

  meetingOpen: function(connectedUserId, meetingId) {
    return sendAjaxRequest({
      id: meetingId,
      connectedUserId: connectedUserId,
      request: 'meetingopen'
    });
  },

  meetingClose: function(connectedUserId, meetingId) {
    return sendAjaxRequest({
      request: 'meetingclose',
      id: meetingId,
      connectedUserId: connectedUserId
    });
  },

  /**
   * @param  {int} meetingId   
   * @return {Promise}         Resolves to the array of topics 
   */
  agendaFetch: function(meetingId) {
    return sendAjaxRequest({
      request: 'agendafetch',
      meetingId: meetingId
    });
  },

  /**
   * @param  {int} meetingId   
   *         {object} topics   Array of topics
   * @return {Promise}         Resolves to the id that the topic was added as
   */
  agendaAddTopic: function(connectedUserId, meetingId, content){
    return sendAjaxRequest({
      request: 'agendaTopicAdd',
      meetingId: meetingId, 
      connectedUserId: connectedUserId,
      content: content
    });
  },

  agendaAddQuestion: function(connectedUserId, meetingId, topicId, content) {
    return sendAjaxRequest({
      request: 'agendaQuestionAdd',
      meetingId: meetingId, 
      topicId: topicId,
      connectedUserId: connectedUserId,
      content: content
    });
  },

  broadcastFetch: function(meetingId) {
    return sendAjaxRequest({
      request: 'broadcastFetch',
      meetingId: meetingId
    });
  },

  broadcastStart: function(connectedUserId, meetingId) {
    return sendAjaxRequest({
      request: 'broadcastStart',
      meetingId: meetingId,
      connectedUserId: connectedUserId
    });
  },

  broadcastEnd: function(connectedUserId, meetingId) {
    return sendAjaxRequest({
      request: 'broadcastEnd',
      meetingId: meetingId,
      connectedUserId: connectedUserId,
    });
  },

  webRTCSendMessage: function(connectedUserId, to, message) {
    return sendAjaxRequest({
      request: 'webRTCSendMessage',
      to: to,
      connectedUserId: connectedUserId,
      message: JSON.stringify(message)
    });
  },

  uploadSendMessage: function(meetingId, data) {
    var formData = new FormData();
    formData.append('img', data);
    formData.append('meetingId', meetingId);
    alert('meetingId')
    return $.ajax({
          type: 'POST',
          url: '/upload',
          data: formData//,
          // processData: false,
          // contentType: false
      }).done(function(data) {
        console.log('Firstframe files successfully uploaded');
        // may want ot suspend user action during video upload
      }).fail(function(e){
        console.log('Firstframe files fail to upload');
      });
  }
};

module.exports = ExampleAPI;
