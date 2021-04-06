function currentUser() {
  return sessionStorage.getItem('userid');
}

function isLoggedIn() {
  return !!sessionStorage.getItem('userid');
}

function setCurrentUser(id) {
  if (!isLoggedIn) {
    sessionStorage.setItem('userid', id);
  } else {
    console.log('setCurrentUser() - User is currently logged in: ', currentUser());
  }
}

function clearCurrentUser() {
  if (isLoggedIn) {
    sessionStorage.removeItem('userid');
  } else {
    console.log('clearCurrentUser() - User is already empty');
  }
}