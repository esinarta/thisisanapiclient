document.addEventListener('DOMContentLoaded', () => {
  const id = sessionStorage.getItem("userId");
  const nameInput = document.querySelector('input[name="name"]');
  const usernameInput = document.querySelector('input[name="username"]');
  if (id) {
    const url = 'http://localhost:3000/api/v1/users/' + id;
    fetch(url).then(res => {
      return res.json();
    }).then(data => {
      nameInput.value = data.name;
      usernameInput.value = data.username;
    });
  } else {
    console.log("/profile : No user id in session");
    window.location = "/login";
  }
});