var LoginModal = require('modals/LoginModal');

function ensureCurrentUser(flux, message) {
  var modalActions = flux.getActions('modal'),
      currentUserStore = flux.getStore('currentUser');

  return new Promise(function(resolve, reject) {
    var currentUser = currentUserStore.getCurrentUser();

    if (currentUser !== null) {
      resolve(currentUser);
      return;
    }

    modalActions.push(
      LoginModal,
      {
        message: message,
        onComplete: () => resolve(currentUserStore.getCurrentUser()),
        onCancel: () => reject(null)
      }
    );
  });
}

module.exports = ensureCurrentUser;