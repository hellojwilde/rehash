var LoginModal = require('components/modals/LoginModal');

function ensureCurrentUser(flux) {
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
      () => resolve(currentUserStore.getCurrentUser()),
      () => reject(null)
    );
  });
}

module.exports = ensureCurrentUser;