const mongoose = require("mongoose");
require("../models/StudentSchema");
const User = mongoose.model("student");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { response } = require("express");
const refreshTokens = require("../refreshTokens");
const nodemailer = require("nodemailer");
const uuid = require("uuid");

/* ***************************** Login ****************************** */

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

/* ************************************************************************* */

/* ***************************** Register ****************************** */

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

    // Generate UUID for _id
    const userId = uuid.v4();

    const hashedPassword = await bcrypt.hash(password, 15);

    const user = await User.create(
      {
        _id: userId,
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
      },
      {
        _id: 1,
        userName: 1,
        email: 1,
        phoneNumber: 1,
        image: 1,
        address: 1,
        dateOfBirth: 1,
        age: 1,
        isVerified: 1,
      }
    );

    // Generate a verification code
    generateVerificationCode(email);

    sendEmail(email);

    res.status(201).json({ message: "User created successfully.", user });
  } catch (err) {
    next(err);
  }
};

/* ************************************************************************* */

/* ***************************** verifyCode ****************************** */

exports.verifyCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found.");
    }

    // Check if the provided code matches the stored code
    if (user.verificationCode !== code) {
      throw new Error("Invalid verification code.");
    }

    if (user.verificationCode === code) {
      console.log("Code correct");
      const updatedUser = await User.updateOne(
        { email: email },
        {
          $set: {
            isVerified: true,
          },
        }
      );

      res.status(201).json({ message: "User is Verified.", updatedUser });
    }
  } catch (err) {
    next(err);
  }
};

/* ************************************************************************* */

/* ***************************** calculateAge ****************************** */

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

/* ************************************************************************* */

/* ***************************** sendEmail ****************************** */

async function sendEmail(email) {
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
    text: `Thank you for registering! Your verification code is: ${User.verificationCode}`,
  };

  // Send the registration confirmation email
  await transporter.sendMail(mailOptions);
}

/* ************************************************************************* */

/* ***************************** generateVerificationCode ****************************** */

async function generateVerificationCode(email) {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    User.verificationCode = verificationCode;
    const updatedUser = await User.updateOne(
      { email: email },
      {
        $set: {
          verificationCode: verificationCode,
        },
      }
    );

    if (updatedUser.nModified === 0) {
      throw new Error("User not found or not updated.");
    }
    return {
      message: "Verification code updated successfully",
      data: updatedUser,
    };
  } catch (err) {
    throw new Error(`Error updating verification code: ${error.message}`);
  }
}

/* ************************************************************************* */

/* ***************************** deleteExpiredVerificationCodes ****************************** */

async function deleteExpiredVerificationCodes() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  await User.updateMany(
    {
      verificationCode: { $ne: null },
      lastVerificationCodeRequest: { $lt: thirtyMinutesAgo },
    },
    { $unset: { verificationCode: 1 } }
  );
}
/* ************************************************************************* */

/* ***************************** createAccessToken ****************************** */

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

/* ************************************************************************* */

/* ***************************** createAccessToken ****************************** */

function createRefreshToken(email, role) {
  const payload = {
    email: email,
    role: role,
  };

  const token = JWT.sign(payload, process.env.REFRESH_SECRET_KEY);
  return token;
}

/* ************************************************************************* */
