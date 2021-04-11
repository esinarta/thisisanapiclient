var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

// GET all endpoints
router.get('/', (req, res) => {
  const userid = req.session.userid;
  if (userid === undefined) {
    res.redirect('/login');
    return;
  }

  fetch(process.env.API_URL + '/api/v1/users/' + userid + '/endpoints',
  { 
    headers: {
      'Authorization': 'Bearer ' + req.session.token
    }
  })
  .then(response => {
    return response.json();
  }).then(json => {
    let endpoints = json;
    if (json.message) endpoints = [];
    res.render(
      'endpoints_index',
      {
        title: 'Endpoints',
        endpoints,
        userid: req.session.userid
      }
    );
  });
}); 

// GET new endpoint page
router.get('/new', (req, res) => {
  const userid = req.session.userid;
  if (userid === undefined) {
    res.redirect('/login');
    return;
  }

  res.render(
    'endpoints_new',
    {
      title: 'Create New Endpoint',
      userid: req.session.userid
    }
  );
});

router.get('/:name/edit', (req, res) => {
  const userid = req.session.userid;
  if (userid === undefined) {
    res.redirect('/login');
    return;
  }

  const path = `/api/v1/users/${req.session.userid}/endpoints/${req.params.name}`;

  fetch(process.env.API_URL + path, {
    headers: {
      'Authorization': 'Bearer ' + req.session.token
    }
  }).then(response => {
    return response.json();
  }).then(data => {
    res.render(
      'endpoints_edit',
      { 
        title: 'Edit Endpoint',
        userid,
        name: data.endpoint.name,
        data: data.endpoint.data
      }
    );
  }).catch(err => {
    throw err;
  });
});

// Edit an endpoint
router.post('/edit', (req, res) => {
  const userid = req.session.userid;

  if (userid === undefined) {
    res.redirect('/login');
    return;
  }

  const originalName = req.body.originalName;
  const endpoint = {
    name: req.body.endpointName,
    data: req.body.endpointData
  }

  const path = `/api/v1/users/${req.session.userid}/endpoints/${originalName}`;

  fetch(process.env.API_URL + path, {
    method: 'PUT',
    body: JSON.stringify(endpoint),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.token
    }
  }).then(response => {
    return response.json();
  }).then(data => {
    res.redirect('/endpoints');
  }).catch(err => {
    throw err;
  });
});

router.post('/:name/delete', (req, res) => {
  const userid = req.session.userid;

  if (userid === undefined) {
    res.redirect('/login');
    return;
  }

  const name = req.params.name;

  const path = `/api/v1/users/${req.session.userid}/endpoints/${name}`;

  fetch(process.env.API_URL + path, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + req.session.token
    }
  }).then(response => {
    return response.json();
  }).then(data => {
    res.redirect('/endpoints');
  }).catch(err => {
    throw err;
  });
});

// POST to endpoints
router.post('/', (req, res) => {
  const userid = req.session.userid;

  if (userid === undefined) {
    res.redirect('/login');
    return;
  }

  const endpoint = {
    name: req.body.endpointName,
    data: req.body.endpointData
  }
  console.log(endpoint);

  const path = `/api/v1/users/${req.session.userid}/endpoints/`;

  fetch(process.env.API_URL + path, {
    method: 'POST',
    body: JSON.stringify(endpoint),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + req.session.token
    }
  }).then(response => {
    return response.json();
  }).then(data => {
    res.redirect('/endpoints');
  }).catch(err => {
    throw err;
  });
});

// GET endpoint by name
router.get('/:name', (req, res) => {

});

// PUT endpoint
router.put('/:name', (req, res) => {
});

// DELETE endpoint
router.delete('/:name', (req, res) => {
});

module.exports = router;