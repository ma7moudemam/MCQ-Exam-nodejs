const mongoose = require("mongoose");

const student = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: "ce5ce00c-a86e-4431-92a9-4869c5f13a5d", // Replace with a default UUID or remove this line if unnecessary
    },
    userName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
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
    confirmPassword: {
      type: String,
      require: true,
      trim: true,
    },
    image: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    day: {
      type: Number,
    },
    month: {
      type: Number,
    },
    year: {
      type: Number,
    },

    blocked: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    lastVerificationCodeRequest: {
      type: Date,
      default: null,
    },
    requestsToday: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    totalGrads: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

mongoose.model("student", student);
