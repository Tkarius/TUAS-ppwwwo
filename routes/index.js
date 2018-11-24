var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Comic Reviewer', pageTitle:'Home', pageDescription:'Welcome to Comic Reviewer!' });
});

module.exports = router;
