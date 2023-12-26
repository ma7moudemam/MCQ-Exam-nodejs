const mongoose = require("mongoose");
const slugify = require("slugify");
require("../models/StudentSchema");
const Student = mongoose.model("student");
const uuid = require("uuid");

exports.getAllStudents = (req, res, next) => {
  const page = req.body.page * 1 || 1;
  const limit = req.body.limit * 1 || 20;
  const skip = (page - 1) * limit;

  Student.find(
    {},
    {
      _id: 1,
      userName: 1,
      email: 1,
      phoneNumber: 1,
      image: 1,
      address: 1,
      dateOfBirth: 1,
      isVerified: 1,
    }
  )
    .skip(skip)
    .limit(limit)
    .then((data) => {
      if (data.length == 0) throw new Error("student Not Found");
      res.status(200).json({ results: data.length, page, data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getStudent = async (req, res, next) => {
  try {
    Student.findById(req.params.id).then((data) => {
      if (data == null) throw new error("Student not Found");
      res.status(200).json({ data });
    });
  } catch (err) {
    next(err);
  }
};

// exports.blockStudent = async (req, res, next) => {
//   try {
//     const data = await Student.updateOne(
//       { _id: req.body.id },
//       {
//         $set: {
//           blocked: true,
//         },
//       }
//     );

//     if (data.nModified === 0) {
//       throw new error("Student not Found");
//     }

//     res.status(200).json({ message: "Student Blocked", data });
//   } catch (err) {
//     next(err);
//   }
// };

exports.toggleBlocked = async (req, res, next) => {
  try {
    const studentId = req.body.id;
    const student = await Student.findById(studentId);

    if (!student) {
      throw new error("Student Not Found");
    }
    const newBlockStatus = !student.blocked;

    const data = await Student.updateOne(
      { _id: req.body.id },
      {
        $set: {
          blocked: newBlockStatus,
        },
      }
    );

    res.status(200).json({
      message: `Student ${newBlockStatus} ? 'blocked' :'unBlocked'`,
      blocked: newBlockStatus,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);

    if (!student) {
      throw new error("Student not Found");
    }

    if (student) {
      const deleteStudent = await Student.findByIdAndDelete(studentId);
    }

    if (!this.deleteStudent) {
      throw new error("Student not found after deletion");
    }

    res
      .status(200)
      .json({ message: "Student deleted successfully", deleteStudent });
  } catch (err) {
    next(err);
  }
};

exports.updateStudentData = async (req, res, next) => {
  try {
    const studentID = req.params.id;

    const existingStudent = await Student.findById(studentID);
    if (!existingStudent) {
      throw new error("Student not Found");
    }

    const updatedStudent = await Student.updateOne(
      {
        _id: studentId,
      },
      {
        $set: {
          ...req.body,
        },
      }
    );

    if (!updatedStudent) {
      throw new Error("student not found");
    }

    if (updatedStudent) {
      res.status(201).json({ message: "Student updated", updatedStudent });
    }

    res.status();
  } catch (err) {
    next(err);
  }
};
