const express = require('express');
const router = express.Router();
const controller = require('../controllers/StudentController');
const { body } = require("express-validator");

const isAuth = require('../MiddleWares/authMW');
const isAdmin = require('../MiddleWares/adminAuthMw');


/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     description: Retrieve a list of all students
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


router.get('/',isAdmin, controller.getAllStudents )
        .put('/blockStudent' , isAdmin , controller.toggleBlocked)



module.exports = router;