const mongoose = require("mongoose");
const slugify = require("slugify");
require("../models/subjectSchema");
const Subjects = mongoose.model("subject");
const uuid = require("uuid");


exports.getAllSubjects = (req, res, next) => {
    const page = req.body.page * 1 || 1;
    const limit =req.body.limit * 1 || 20;
    const skip = (page-1)*limit;

    Subjects.find({} , { _id: 1, name: 1 , slug:1}).skip(skip).limit(limit)
    .then((data) => {
      if (data.length == 0) throw new Error("Subjects Not Found");
      res.status(200).json({results:data.length , page,data});
    })
    .catch((err) => {
      next(err);
    });
};

exports.getSubject = async (req , res, next)=>{
    Subjects.findById(req.params.id)
    .then((data) => {
      if (data == null) throw new Error("Subject Not Found");
      res.status(200).json({ data });
    })
    .catch((err) => {
      next(err);
    });
}


exports.addNewSubject = async (req, res, next) => {
  try {

    const subjectId = uuid.v4();

    let subject = new Subjects({
      _id:subjectId,
      name: req.body.name,
      slug: slugify(req.body.name),
      questions: req.body.questions,
    });

    const newSubject = await subject.save();
    res.type('json');
    res.status(201).json(newSubject);
  } catch (error) {
    next(error);
  }
};

exports.updateSubject = async(req , res,next)=>{
    try{
        Subjects.updateOne(
            {_id:req.body._id},
            {
                $set:{
                    name:req.body.name,
                    slugify:slugify(req.body.name),
                    questions:req.body.questions
                }
            }
        )

        if(data==null) throw new Error("Subject NotFound");
        res.status(200).json({message:"updated" , data})

    }
    catch(err){
        next(err);
    }
}

exports.deleteSubject = async (req , res, next)=>{
    try{
      Subjects.findByIdAndDelete(req.params.id)
              .then((data)=>{
                if(data == null) throw new Error("Subject Not Found");
                res.status(200).json({message:"Subject Deleted"});
              })
    }
    catch(err){
      next(err)
    }
}