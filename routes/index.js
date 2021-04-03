var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/admin', (req, res, next) => {
  // process.env.API_URL = https://thisisanapiserver.herokuapp.com
  fetch(process.env.API_URL + '/requests')
    .then(result => result.json())
    .then(json => {
      res.render('admin', { title: 'Admin Page', requests: json });
    });
});

module.exports = router;
