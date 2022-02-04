var express = require('express');
var router = express.Router();
const { body } = require('express-validator'); 
const loginController = require("../controllers/login");

/* GET login page. */
router.get('/', loginController.loginPage);
router.post('/', 
body('user_name').not().isEmpty().withMessage('Username is require').trim().escape(),
body('password').not().isEmpty().withMessage('Password is require').trim().escape(),
loginController.loginFormProcess);

module.exports = router;
