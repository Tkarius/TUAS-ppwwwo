var express = require('express');
var router = express.Router();

var comicController = require('../controllers/comicController');

//router.get('/', comicController.comic_list);

router.get('/list/:sorting', comicController.comic_list)