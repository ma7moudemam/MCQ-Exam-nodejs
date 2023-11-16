const mongoose = require('mongoose');


const subject = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    slug:{
      type:String,
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
    },
    questionTime:{
      type:Number,
      required:true,
    }
  });



mongoose.model('subject', subject);