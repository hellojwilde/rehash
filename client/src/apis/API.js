/*
API to submit and retrieve user/meeting/broadcast/agenda/question/topics to and from server
*/


var _ = require('lodash');
var moment = require('moment');

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
      error: (emessage) => handleAjaxError(emessage, reject)
    });
  });
}

var API = {
  /**
   *  @param  {string}       userId  
   *  @return {Promise}      Resolves to the user object.
   */
  connectedUserFetch: function(connectedUserId) {
    return sendAjaxRequest({
      request: 'connectedUserFetch'
    });
  },

  /**
   * @param  {string}        userId Unlike meeting ids, the userId is a string.
   * @return {Promise}       Resolves to the user object.
   */
  userFetch: function(userId) {
    return sendAjaxRequest({
      request: 'userFetch',
      userId: userId
    });
  },

  /**
   * @return {Promise} Resolves to an array of meeting objects.
   */
  exploreFetch: function() {
    return sendAjaxRequest({
      request: 'exploreFetch'
    }).then((meetings) => meetings.map((meeting) => {
      meeting.start = moment.utc(meeting.start);
      return meeting;
    }));
  },

  /**
   * @param  {number} meetingId The id of the meeting to fetch.
   * @return {Promise}           Resolves to a meeting object.
   * 
   * If the user jumps to a standalone meeting page (e.g. from a tweet),
   * we won't have the meeting already cached from the explore page.
   * This fetches a single specific meeting to display in the app.
   */
  meetingFetch: function(meetingId) {
    return sendAjaxRequest({
      request: 'meetingFetch',
      id: meetingId
    }).then((meeting) => {
      meeting.start = moment.utc(meeting.start);
      return meeting;
    });
  },

  /**
   * @param  {string} connectedUserId  userId for connected user
   * @param  {object} meeting          A meeting object 
   * @return {Promise}                 Resolves to an object of shape {id: KEY} 
   *                                   that the meeting was saved as.
   * 
   * When we create the meeting initially, we want to force the user to set
   * a title and start time, and encourage them to set description and cover
   * photo so that we have a nice-looking, sortable tile to display in the feed
   * immediately.
   * 
   * This should set up a blank agenda, along with an attendee list containing 
   * the user that created the meeting.
   */
  meetingCreate: function(connectedUserId, meeting) {
    return sendAjaxRequest({
      request: 'meetingCreate',
      connectedUserId: connectedUserId,
      title: meeting.title, 
      description: meeting.description,
      start: moment.utc(meeting.start).toISOString()
    });
  },

  /**
   * @param  {string} connectedUserId  userId for connected user
   * @param  {string} meetingId  
   * @param  {object} meeting          A meeting object without an id.
   * @return {Promise}                 Resolves to an object of shape {id: KEY} 
   *                                   that the meeting was saved as.
   */ 
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

  /**
   * @param  {string} connectedUserId  userId for connected user
   * @param  {string} meetingId  
   * @return {Promise}                 Empty Promise
   */ 
  meetingSubscribe: function(connectedUserId, meetingId) {
    return sendAjaxRequest({
      id: meetingId, 
      connectedUserId: connectedUserId,
      request: 'meetingsubscribe'
    });
  },

  /**
   * @param  {string} connectedUserId  userId for connected user
   * @param  {string} meetingId  
   * @return {Promise}                 Empty Promise
   */ 
  meetingOpen: function(connectedUserId, meetingId) {
    return sendAjaxRequest({
      id: meetingId,
      connectedUserId: connectedUserId,
      request: 'meetingopen'
    });
  },

  /**
   * @param  {string} connectedUserId  userId for connected user
   * @param  {string} meetingId  
   * @return {Promise}                 Empty Promise
   */ 
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

  /**
   * @param  {string} connectedUserId  
   * @param  {string} meetingId  
   * @param  {string} topicId
   * @param  {string} content  
   * @return {Promise}                 Resolve to question
   */ 
  agendaAddQuestion: function(connectedUserId, meetingId, topicId, content) {
    return sendAjaxRequest({
      request: 'agendaQuestionAdd',
      meetingId: meetingId, 
      topicId: topicId,
      connectedUserId: connectedUserId,
      content: content
    });
  },

  /**
   * @param  {string} meetingId  
   * @return {Promise}                 Resolve to broadcast 
   */ 
  broadcastFetch: function(meetingId) {
    return sendAjaxRequest({
      request: 'broadcastFetch',
      meetingId: meetingId
    });
  },

  /**
   * @param  {string} connectedUserId  
   * @param  {string} meetingId  
   * @return {Promise}                 Empty Promise
   */ 
  broadcastStart: function(connectedUserId, meetingId) {
    return sendAjaxRequest({
      request: 'broadcastStart',
      meetingId: meetingId,
      connectedUserId: connectedUserId
    });
  },

  /**
   * @param  {string} connectedUserId  
   * @param  {string} meetingId  
   * @return {Promise}                 Empty Promise
   */ 
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
  }
};

module.exports = API;
