var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'This is an API' });
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
  res.render('register', { title: 'Registration Page' });
});

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login Page' });
});

router.get('/profile', (req, res, next) => {
  let id = 10;
  fetch(process.env.API_URL + `/api/v1/users/${id}`)
  .then(result => result.json())
  .then(json => {
    res.render('profile', { title: 'My Profile', data: json });
  });
});



module.exports = router;
