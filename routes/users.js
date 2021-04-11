var express = require('express');
const { default: fetch } = require('node-fetch');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/edit', (req, res) => {
  const userid = req.session.userid;

  if (userid === undefined) {
    res.redirect('/login');
    return;
  }

  const user = {
    name: req.body.name,
    username: req.body.username
  }

  const path = `/api/v1/users/${req.session.userid}`;

  fetch(process.env.API_URL + path, {
    method: 'PUT',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.token
    }
  }).then(response => {
    return response.json();
  }).then(data => {
    res.redirect('/profile');
  }).catch(err => {
    throw err;
  });
});

router.post('/delete', (req, res) => {
  const userid = req.session.userid;

  if (userid === undefined) {
    res.redirect('/login');
    return;
  }

  const path = `/api/v1/users/${userid}`;

  fetch(process.env.API_URL + path, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + req.session.token
    }
  }).then(response => {
    return response.json();
  }).then(data => {
    req.session.userid = undefined;
    res.redirect('/');
  }).catch(err => {
    throw err;
  });
});

module.exports = router;
