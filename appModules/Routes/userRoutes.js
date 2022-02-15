
const express = require('express')

const router = express.Router();

const {isAuth} =require("../../utils/isAuth")

const controller = require('../Controllers/user');

router.post('/login', controller.login);
router.post('/signup', controller.signUp);
router.get('/users', isAuth, controller.getAllUser);
router.get('/current_user', isAuth, controller.getCurrentUser);

module.exports = router