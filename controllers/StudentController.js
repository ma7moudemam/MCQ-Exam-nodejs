const mongoose = require('mongoose');
const slugify = require('slugify');
require('../models/StudentSchema');
const Student = mongoose.model('student');


exports.getAllStudents = (req , res , next) =>{

    const page = req.body.page * 1 || 1;
    const limit =req.body.limit * 1 || 20;
    const skip = (page-1)*limit;

    Student.find({}, {  _id: 1 ,userName:1 , email:1 , phoneNumber:1 ,image:1 , address:1 , dateOfBirth:1 , isVerified:1 }).skip(skip).limit(limit)
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


exports.getStudent = async (req, res, next)=>{
    try{

        const { id} = req.body;
       const student = await Student.findById({id});

    }catch(err){
        next(err);
    }
}