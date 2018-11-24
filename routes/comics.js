var express = require('express');
var router = express.Router();

var comicController = require('../controllers/comicController');

//router.get('/', comicController.comic_list);

router.get('/list/:sorting*?', comicController.comic_list);

router.get('/add', comicController.comic_add_get);

router.post('/add', comicController.comic_add_post);

router.get('/comic/:id', comicController.comic_details);

router.get('/authors/list', comicController.author_list);

router.get('/authors/author/:id', comicController.author_details);

module.exports = router;