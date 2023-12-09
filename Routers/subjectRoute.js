const express = require('express');
const router = express.Router();
const controller = require('../controllers/subjectController');
const { body } = require("express-validator");
const isAuth = require('../MiddleWares/authMW');



router.get('/',isAuth, controller.getAllSubjects)
        .get('/:id?',isAuth, controller.getSubject)
        .post('/', isAuth ,controller.addNewSubject)

module.exports = router;