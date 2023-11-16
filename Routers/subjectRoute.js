const express = require('express');
const router = express.Router();
const controller = require('../controllers/subjectController');
const { body } = require("express-validator");
const isAuth = require('../MiddleWares/authMW');



router.get('/',controller.getAllSubjects)
        .get('/:id?', controller.getSubject)
        .post('/', controller.addNewSubject)

module.exports = router;