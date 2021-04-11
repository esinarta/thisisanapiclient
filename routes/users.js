var express = require('express');
const { default: fetch } = require('node-fetch');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
