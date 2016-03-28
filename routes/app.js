var router = require('express').Router();

router.get('/', function(req, res) {
  res.render('app/index', {bodyclass: 'home', pagetitle: 'Tussen Kunst en Kitsch'});
});

router.get('/spelen', function(req, res) {
  if(req.session.user != undefined) {
    res.render('app/spelen', {bodyclass: 'spelen', pagetitle: 'Het Expertspel', naam: req.session.user})
  } else {
    res.render('app/spelen-start', {bodyclass: 'spelen', pagetitle: 'Het Expertspel'});
  }
});

router.post('/spelen', function(req, res) {
  req.session.user = req.body.naam;
  res.redirect('/spelen');
});

router.get('/opnamedagen', function(req, res) {
  res.render('app/opnamedagen', {bodyclass: 'opnamedagen', pagetitle: 'Opnamedagen 2016'});
});

module.exports = router;
