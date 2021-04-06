var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'This is an API', userid: req.session.userid });
});

router.get('/admin', (req, res, next) => {
  // process.env.API_URL = https://thisisanapiserver.herokuapp.com
  fetch(process.env.API_URL + '/api/v1/requests')
    .then(result => result.json())
    .then(json => {
      res.render('admin', { title: 'Admin Page', requests: json });
    });
});

router.get('/register', (req, res, next) => {
  if (req.session.userid) {
    res.redirect('/profile');
  }
  res.render('register', { title: 'Registration Page', userid: req.session.userid });
});

router.post('/register', (req, res) => {
  const user = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password
  }

  fetch(process.env.API_URL + '/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    req.session.userid = data.id;
    res.redirect('/');
  }).catch(err => console.error(err));
});

router.get('/login', (req, res, next) => {
  console.log(req.session.userid);
  if (req.session.userid !== undefined) {
    res.redirect('/profile');
  }
  res.render('login', { title: 'Login Page', userid: req.session.userid });
});

router.post('/login', (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password
  };

  fetch(process.env.API_URL + '/api/v1/auth/users', {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(data => {
    req.session.userid = data.id;
    res.redirect('/profile');
  }).catch(err => console.error(err));
});

router.get('/profile', (req, res, next) => {
  const userid = req.session.userid;
  if (!userid) res.redirect('/login');

  fetch(process.env.API_URL + '/api/v1/users/' + userid)
  .then(res => res.json())
  .then(data => {
    const user = data;
    res.render('profile', { title: 'My Profile', user, userid: req.session.userid});
  });
});

module.exports = router;