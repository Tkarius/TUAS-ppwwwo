var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.users_list);

/**GET user details */
router.get('/:id', userController.user_details);

router.get('/register', userController.user_create_get);

router.post('/register', userController.user_create_post);

module.exports = router;
