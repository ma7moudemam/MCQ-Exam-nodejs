const express = require('express');
const router = express.Router();
const controller = require('../controllers/StudentController');
const { body } = require("express-validator");

const isAuth = require('../MiddleWares/authMW');
const isAdmin = require('../MiddleWares/adminAuthMw');



router.get('/',isAdmin, controller.getAllStudents )



module.exports = router;