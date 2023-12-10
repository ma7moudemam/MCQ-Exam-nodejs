const express = require('express');
const router = express.Router();
const controller = require('../controllers/subjectController');
const { body } = require("express-validator");
const isAuth = require('../MiddleWares/authMW');


/**
 * @swagger
 * /subject:
 *   get:
 *     summary: Get all subjects
 *     description: Retrieve a list of all subjects
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Success
 *               data: [student1, student2]
 *       '500':
 *         description: Internal Server Error
 */



router.get('/',isAuth, controller.getAllSubjects)
        .get('/:id?',isAuth, controller.getSubject)
        .post('/', isAuth ,controller.addNewSubject)

module.exports = router;