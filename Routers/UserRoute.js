const express = require('express');
const router = express.Router();
const controller = require('../controllers/AuthenticationController.js');
const { body } = require("express-validator");
const isAuth = require('../MiddleWares/authMW.js')



router.post('/login' , controller.login)
        .post('/register' , controller.register)
        .post('/verify-code' , isAuth,controller.verifyCode)
       



module.exports = router;