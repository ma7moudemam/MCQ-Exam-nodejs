const mongoose = require("mongoose");

const student = new mongoose.Schema(
  {
    userName: {
      type: String,
      require: true,
    },
    email: {
        type:String,
        required:true,
        trim: true
    },
    phoneNumber: {
      type: String,
      require: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    address: {
      city: {
        type: String,
        require: true,
      },
      street: {
        type: String,
        require: true,
      },
      building: {
        type: String,
        require: true,
      },
    },
    dateOfBirth: {
      day: {
        type: Number,
        required: true,
      },
      month: {
        type: Number,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    verificationCode:{
      type:String,
    },
    lastVerificationCodeRequest: {
      type: Date,
      default: null,
    },
    requestsToday: {
      type: Number,
      default: 0,
    },
    isVerified:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);


mongoose.model('student', student);