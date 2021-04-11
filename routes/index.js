var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  const logged_in = req.session.userid !== undefined;
  res.render('home', { title: 'This is an API', userid: req.session.userid, logged_in });
});

router.get('/admin/login', (req, res) => {
  if (req.session.admin_token !== undefined) {
    res.redirect('/admin');
  }
  res.render('adminlogin', { title: 'Admin Login', errorMsg: "", userid: req.session.userid });
});

router.post('/admin/login', (req, res) => {
  if (req.session.admin_token !== undefined) {
    res.redirect('/admin');
    return;
  }
  const admin = {
    username: req.body.username,
    password: req.body.password
  };

  fetch(process.env.API_URL + '/api/v1/auth/admins', {
    method: 'POST',
    body: JSON.stringify(admin),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.status !== 201) {
      res.redirect('/admin/login');
      return;
    }
    return response.json();
  }).then(data => {
    const token = jwt.decode(data.jwt);
    req.session.admin_token = data.jwt;
    res.redirect('/admin');
  }).catch(err => console.error("POST /admin/login", err));
});

router.get('/admin', (req, res, next) => {
  if (req.session.admin_token === undefined) {
    res.redirect('/admin/login');
  }
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
    const token = jwt.decode(data.jwt);
    req.session.userid = token.id;
    req.session.token = data.jwt;
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
    const token = jwt.decode(data.jwt);
    req.session.userid = token.id;
    req.session.token = data.jwt;
    res.redirect('/endpoints');
  }).catch(err => console.error("POST /login", err));
});

router.get('/logout', (req, res) => {
  if (req.session.userid) {
    req.session.userid = undefined;
    req.session.token = undefined;
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
    fetch(process.env.API_URL + '/api/v1/users/' + userid, {
      headers: {
        'Authorization': 'Bearer ' + req.session.token
      }
    })
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

module.exports = router;