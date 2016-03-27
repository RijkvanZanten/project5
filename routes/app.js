var router = require('express').Router();

router.get('/', function(req, res) {
  res.render('app/index', {bodyclass: 'home', pagetitle: 'Tussen Kunst en Kitsch'});
});

router.get('/spelen', function(req, res) {
  if(req.session.user != '') {
    res.render('app/spelen', {bodyclass: 'spelen', pagetitle: 'Het Expertspel'})
  } else {
    res.render('app/spelen-start', {bodyclass: 'spelen', pagetitle: 'Het Expertspel'});
  }
});

router.post('/spelen', function(req, res) {
  res.redirect('/spelen');
});

module.exports = router;
