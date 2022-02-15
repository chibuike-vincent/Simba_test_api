const express = require('express')

const router = express.Router();

const {isAuth} =require("../../utils/isAuth")

const controller = require('../Controllers/transactions');

router.post('/create', isAuth, controller.createTransaction);
router.get('/', isAuth, controller.allTransaction);

module.exports = router;