var express = require('express');
var router = express.Router();
const { body } = require('express-validator');
const usersController = require("../controllers/users");

/* GET users listing. */
router.get('/', usersController.list);
router.get('/add', usersController.add);
router.get('/edit', usersController.edit);
router.get('/delete', usersController.delete);
router.get('/update-status', usersController.updateStatus);

router.post('/add',
body('first_name').not().isEmpty().withMessage('First name is require').bail().trim().escape(),
body('last_name').not().isEmpty().withMessage('Last name is require').bail().trim().escape(),
body('email').not().isEmpty().withMessage('Email is require').bail().trim().escape().isEmail().withMessage('Email is not valid'),
body('user_status').not().isEmpty().isBoolean().withMessage('Status is not valid').bail().trim().escape(),
body('age').trim().escape(),
body('phone_number').trim().escape(),
body('address').trim().escape(),
usersController.addForm);

router.post('/edit',
body('first_name').not().isEmpty().withMessage('First name is require').bail().trim().escape(),
body('last_name').not().isEmpty().withMessage('Last name is require').bail().trim().escape(),
body('email').not().isEmpty().withMessage('Email is require').bail().trim().escape().isEmail().withMessage('Email is not valid'),
body('user_status').not().isEmpty().isBoolean().withMessage('Status is not valid').bail().trim().escape(),
body('age').trim().escape(),
body('phone_number').trim().escape(),
body('address').trim().escape(),
usersController.editForm);

module.exports = router;
