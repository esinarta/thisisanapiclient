document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#loginForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    sendFormData(form, '/auth/users')
      .then(res => {
        console.log(res);
        switch (res.status) {
          case 200:
            console.log("Login successful");
            return res.json();
          case 401:
            console.log("Wrong Password");
            return res.json();
          default:
            return res.json();
        }
      }).then(data => {
        console.log(data);
        if (data.error) {
          alert(data.error);
        } else {
          sessionStorage.setItem("userId", data.id);
          window.location = "/profile";
        }
      }).catch(err => {
        console.error("Error: ", err);
      });
    });
});