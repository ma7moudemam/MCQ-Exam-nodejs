const express = require('express');
const router = express.Router();
const controller = require('../controllers/AuthenticationController.js');
const { body } = require("express-validator");



router.post('/login' , controller.login)
        .post('/register' , controller.register)
        .post('/verifyCode' , controller)


module.exports = router;