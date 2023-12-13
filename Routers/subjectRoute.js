const express = require('express');
const router = express.Router();
const controller = require('../controllers/subjectController');
const { body } = require("express-validator");
const isAuth = require('../MiddleWares/authMW');
const isAdmin = require('../MiddleWares/adminAuthMw');



router.get('/',isAuth, controller.getAllSubjects)
        .get('/:id?',isAuth, controller.getSubject)
        .post('/', isAuth ,controller.addNewSubject)
        .delete('/:id?',isAuth,controller.deleteSubject)

module.exports = router;


/**
 * @swagger
 * /subjects:
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

/**
 * @swagger
 * /subject:
 *   get:
 *     summary: Get subject
 *     description: Retrieve a subject
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


