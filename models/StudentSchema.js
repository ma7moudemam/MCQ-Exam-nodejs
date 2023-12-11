const mongoose = require("mongoose");


const student = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: 'ce5ce00c-a86e-4431-92a9-4869c5f13a5d', // Replace with a default UUID or remove this line if unnecessary
    },
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
    },
    totalGrads: {
      type: Number,
      default: 0,
    },
    
  },
  { timestamps: true }
);


mongoose.model('student', student);