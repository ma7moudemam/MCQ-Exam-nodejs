const express = require('express');
const router = express.Router();
const controller = require('../controllers/StudentController');
const { body } = require("express-validator");


router.get('/', controller.getAllStudents)



module.exports = router;