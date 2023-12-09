const express = require('express');
const router = express.Router();
const controller = require('../controllers/StudentController');
const { body } = require("express-validator");

const isAuth = require('../MiddleWares/authMW');


router.get('/',isAuth, controller.getAllStudents )



module.exports = router;