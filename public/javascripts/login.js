const form = document.querySelector('#loginForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  fetch('http://localhost:3000/api/v1/auth/users', {
    method: "POST",
    body: new FormData(form)
  }).then(res => {
    return res.json();
  }).then(data => {
    console.log(data);
  });
});