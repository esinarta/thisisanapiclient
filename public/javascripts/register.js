document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#registrationForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    sendFormData(form, '/users')
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });

  });
});