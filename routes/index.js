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
    .then(response => {
      if (response.status !== 200) {
        res.redirect('/');
        return;
      }
      return response.json();
    }).then(json => {
      res.render('admin', { title: 'Admin Page', requests: json, userid: req.session.userid });
    });
});

router.get('/register', (req, res, next) => {
  if (req.session.userid) {
    res.redirect('/profile');
  }
  res.render('register', { title: 'Registration Page', userid: req.session.userid, errorMsg: "" });
});

router.post('/register', (req, res) => {
  if (req.session.userid !== undefined) {
    res.redirect('/profile');
  }
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
  .then(response => {
    if (response.status !== 201) {
      res.render('register', { title: 'Registration Page', userid: req.session.userid, errorMsg: "Username already exists." });
      return;
    }
    return response.json();
  }).then(data => {
    req.session.userid = data.id;
    res.redirect('/');
  }).catch(err => console.error("POST /register", err));
});

router.get('/login', (req, res, next) => {
  if (req.session.userid !== undefined) {
    res.redirect('/profile');
  }
  res.render('login', { title: 'Login Page', userid: req.session.userid, errorMsg: "" });
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
  .then(response => {
    if (response.status !== 201) {
      res.render('login', { title: 'Login Page', userid: req.session.userid, errorMsg: "Username and/or password incorrect." });
      return;
    }
    return response.json();
  }).then(data => {
    req.session.userid = data.id;
    res.redirect('/endpoints');
  }).catch(err => console.error("POST /login", err));
});

router.get('/logout', (req, res) => {
  if (req.session.userid) {
    req.session.userid = undefined;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

router.get('/profile', (req, res, next) => {
  const userid = req.session.userid;
  if (userid === undefined) {
    res.redirect('/login');
    return;
  } else {
    fetch(process.env.API_URL + '/api/v1/users/' + userid)
    .then(response => {
      if (response.status !== 200) {
        res.redirect('/login');
        return;
      }
      return response.json();
    }).then(data => {
      if (data.error) {
        res.redirect('/');
        return;
      }
      const user = data;
      res.render('profile', { title: 'My Profile', user, userid});
    });
  }
});

router.get('/endpoints', (req, res, next) => {
  const userid = req.session.userid;
  if (userid === undefined) {
    res.redirect('/login');
    return;
  }

  fetch(process.env.API_URL + '/api/v1/users/' + userid + '/endpoints')
  .then(response => {
    return response.json();
  }).then(json => {
    res.render('endpoints', { title: 'Endpoints', endpoints: json, userid: req.session.userid });
  });
});

router.get('/create', (req, res, next) => {
  const userid = req.session.userid;
  if (userid === undefined) {
    res.redirect('/login');
    return;
  }

  res.render('create', { title: 'Create New Endpoint', userid: req.session.userid });
});

router.get('/edit', (req, res, next) => {
  const userid = req.session.userid;
  if (userid === undefined) {
    res.redirect('/login');
    return;
  }
  res.render('edit', { title: 'Edit Endpoint', userid});
});

module.exports = router;