const mongoose = require('mongoose');
const slugify = require('slugify');
require('../models/StudentSchema');
const Student = mongoose.model('student');


exports.getAllStudents = (req , res , next) =>{

    const page = req.body.page * 1 || 1;
    const limit =req.body.limit * 1 || 20;
    const skip = (page-1)*limit;

    Student.find({}).skip(skip).limit(limit)
    .then(
        data=>{
            if(data.length == 0)  throw new Error('student Not Found');
            res.status(200).json({results:data.length , page,data})
        }
    )
    .catch(err=>{
        next(err);
    })
}

