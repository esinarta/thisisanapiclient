function sendFormData(form, path) {
  const baseUrl = 'http://localhost:3000/api/v1';
  const formData = new FormData(form);

  return fetch(baseUrl + path, {
    method: 'POST',
    body: formData
  });
}