var router = require('express').Router();
var secrets = require('../secrets.js');

router.get('/', function(req, res) {
  res.render('video-login', {bodyclass: 'video-login', pagetitle: 'video-login'});
});

router.post('/', function(req, res) {
  if(req.body.username == secrets.videoUser && req.body.password == secrets.videoPass) {
    res.render('video', {bodyclass: 'video'});
  } else {
    res.redirect('/video');
  }
});

module.exports = router;
