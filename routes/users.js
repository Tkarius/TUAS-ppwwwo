var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');


//user register
router.get('/register', userController.user_create_get);

router.post('/register', userController.user_create_post);

//user login
router.get('/login', userController.user_login_get);

router.post('/login', userController.user_login_post);

/**GET user details */
router.get('/:id', userController.user_details);

/* GET users listing. */
router.get('/', userController.user_list);

module.exports = router;
