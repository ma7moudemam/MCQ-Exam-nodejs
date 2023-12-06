const mongoose = require('mongoose');


const subject = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug:{
      type:String,
      unique: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true
        },
        answers: [
          {
            id: {
              type: Number,
              required: true
            },
            text: {
              type: String,
              required: true
            }
          }
        ],
        correctAnswerId: {
          type: Number,
          required: true
        }
      }
    ],
    available:{
      type:Boolean,
      default:false
    },
    examTime:{
      type:Number,
      required:true,
      min: 30,
    },
    questionTime:{
      type:Number,
      required:true,
      min: 1,
    }
  });



mongoose.model('subject', subject);