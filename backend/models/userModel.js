import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import validator from "validator";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    minLength: [3, "Name must contain at least 3 characters"],
    maxLength: [30, "Name cannot exceed 30 characters"],
  },

  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    validate: [validator.isEmail, "Invalid email address"],
  },

  phone: {
    type: String,
    required: [true, "Please provide your phone number"],
    match: [/^\d{10,15}$/, "Phone number should be 10 to 15 digits long"],
  },

  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength: [6, "Password must contain at least 6 characters"],
    // maxLength: [30, "Password cannot exceed 30 characters"],
    select: false,
  },

  role: {
    type: String,
    required: true,
    enum: ["User", "Employee", "Admin"],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  verificationCode: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otpExpireAt: {
    type: Date,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT Token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate OTP
userSchema.methods.generateOTP = function () {
  this.otp = crypto.randomInt(100000, 999999).toString();
  this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
};

const User = mongoose.model("User", userSchema);
export default User;
