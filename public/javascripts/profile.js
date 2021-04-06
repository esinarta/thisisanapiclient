document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#profileForm');
  const nameInput = form.querySelector('input[name="name"]');
  const usernameInput = form.querySelector('input[name="username"]');
  const id = form.querySelector('input[name="id"]').value;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const user = {
      name: formData.get('name'),
      username: formData.get('username'),
      password: formData.get('password')
    };

    fetch('http://localhost:3000/api/v1/users/' + id, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status !== 200) {
        alert('Could not update: ' + response.error);
        // Not successful
        return;
      }
      return response.json();
    }).then(data => {
      nameInput.value = data.name;
      usernameInput.value = data.username;
      // Successful
    }).catch(err => console.error(err));
  });
});