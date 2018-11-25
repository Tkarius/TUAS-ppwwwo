var express = require('express');
var router = express.Router();

var tagController = require('../controllers/tagController');

router.get('/list/:sorting*?', tagController.tag_list);

router.get('/tag/:id', tagController.tag_detail);

router.get('/add', tagController.tag_create_get);

router.post('/add', tagController.tag_create_post);

module.exports = router;