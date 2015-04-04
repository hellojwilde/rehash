var FluxRegistry = require('FluxRegistry');

function getMeetingWillTransitionTo(currentHandlerName) {
  return function(transition, params, query) {
    var {meetingId} = params;
    var currentUserStore = FluxRegistry.getStore('currentUser');

    if (currentUserStore.isHost(meetingId)) {
      return;
    }

    var handlerName = 'meeting-invite';
    
    if (currentUserStore.isParticipant(meetingId)) {
      handlerName = 'meeting-broadcast';
    }

    if (handlerName !== currentHandlerName) {
      transition.redirect(handlerName, params, query);
    }
  };
}

module.exports = getMeetingWillTransitionTo;
