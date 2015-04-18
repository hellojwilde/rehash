var LoginModal = require('modals/LoginModal');

function ensureCurrentUser(flux, message) {
  var modalActions = flux.getActions('modal');
  var currentUserStore = flux.getStore('currentUser');

  return new Promise(function(resolve, reject) {
    var currentUser = currentUserStore.state.user;
    
    if (currentUser !== null) {
      resolve(currentUser);
      return;
    }

    modalActions.push(
      LoginModal,
      {
        message: message,
        onComplete: () => resolve(currentUserStore.state.user),
        onCancel: () => reject(null)
      }
    );
  });
}

module.exports = ensureCurrentUser;