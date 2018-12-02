var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');


//user register
router.get('/register', userController.user_create_get);

router.post('/register', userController.user_create_post);

//user login
router.get('/login', userController.user_login_get);

router.post('/login', userController.user_login_post);

//user logout
router.get('/logout', userController.user_logout_get);

module.exports = router;
