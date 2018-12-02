var express = require('express');
var router = express.Router();

var comicController = require('../controllers/comicController');

//router.get('/', comicController.comic_list);

router.get('/list/:sorting*?', comicController.comic_list);

router.get('/add', comicController.comic_add_get);

router.post('/add', comicController.comic_add_post);

router.post('/comic/:id/rate', comicController.comic_rate_post);

router.get('/comic/:id', comicController.comic_details);

router.post('/addcomment', comicController.comment_add_post);


module.exports = router;