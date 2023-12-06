const mongoose = require("mongoose");
require("../models/StudentSchema");
const User = mongoose.model("student");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { response } = require("express");
const refreshTokens = require("../refreshTokens");
const nodemailer = require("nodemailer");



const verificationCodes = {};


function createAccessToken(email, role, user) {
  const payload = {
    email: email,
    role: role,
    user: user,
  };

  const option = {
    expiresIn: "12h",
  };

  const token = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, option);

  return token;
}

function createRefreshToken(email, role) {
  const payload = {
    email: email,
    role: role,
  };

  const token = JWT.sign(payload, process.env.REFRESH_SECRET_KEY);
  return token;
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      email == process.env.ADMIN_EMAIL &&
      password == process.env.ADMIN_PASSWORD
    ) {
      const token = createAccessToken(email, "admin", { userName: "Admin" });
      const refreshToken = createRefreshToken(email, "admin");

      res.status(200).json({ message: "Welcome Admin", token, refreshToken });
    } else {
      const student = await User.findOne({ email });

      if (!student) {
        throw new Error("Student not found. Please register a new account.");
      }

      const isPasswordValid = await bcrypt.compare(password, student.password);

      if (!isPasswordValid) {
        throw new Error("Email or password is incorrect.");
      }

      const token = createAccessToken(email, "student", student);
      const refreshToken = createRefreshToken(email, "student");
      res.status(200).json({ message: "Welcome Student", token, refreshToken });
    }
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const {
      userName,
      email,
      phoneNumber,
      password,
      image,
      address,
      dateOfBirth,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    // Create a transporter with your SMTP configuration
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.EMAIL_SENDER, // Your email address
        pass: process.env.EMAIL_SENDER_PASSWORD, // Your email password
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_SENDER, // Sender's email address
      to: email, // Recipient's email address
      subject: "Registration Confirmation",
      text: "Thank you for registering!",
    };

     // Send the registration confirmation email
     await transporter.sendMail(mailOptions);

     const user = await User.create({
      userName,
      email,
      phoneNumber,
      password: hashedPassword,
      image,
      address: {
        city: address.city,
        street: address.street,
        building: address.building,
      },
      dateOfBirth: {
        day: dateOfBirth.day,
        month: dateOfBirth.month,
        year: dateOfBirth.year,
      },
      age: calculateAge(dateOfBirth.year, dateOfBirth.month, dateOfBirth.day),
      blocked: false,
    });

    res.status(201).json({ message: "User created successfully.", user });
  } catch (err) {
    next(err);
  }
};


exports.verifyCode = async (req , res, next)=>{
  try{
    const {
      email
    } = req.body;
     // Generate a random 6-digit code (you might want to use a more secure method)
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

   // Store the code in the database
   verificationCodes[email] = verificationCode;

   // Send the verification code to the user (e.g., via email or SMS)
  // For simplicity, we'll just return the code in the response
    res.json({ code: verificationCode });
  }
  catch (err){
    next(err);
  }
}

function calculateAge(year, month, day) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  let age = currentYear - year;

  if (month > currentMonth || (month === currentMonth && day > currentDay)) {
    age--;
  }
  return age;
}

