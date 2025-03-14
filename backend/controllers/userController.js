import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Review from "../models/ReviewModel.js";
import Service from "../models/serviceModel.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendVerificationCode } from "../utils/Email.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import Appointment from "../models/appointmentModel.js";
export const sendOtp = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) return next(new ErrorHandler("Email is required", 400));

  let user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  // Generate OTP and save
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 1 minutes expiry

  user.verificationCode = otp;
  user.otpExpireAt = otpExpiry;
  await user.save();

  sendVerificationCode(email, otp);

  res.status(200).json({
    success: true,
    message: "OTP sent successfully!",
  });
});

// Step 2: Verify OTP and login
export const verifyOtp = catchAsyncError(async (req, res, next) => {
  const { code } = req.body;
  const user = await User.findOne({ verificationCode: code });
  if (!user) return next(new ErrorHandler("Invalid email or OTP", 400));

  if (user.otpExpireAt < new Date()) {
    return res
      .status(400)
      .json({ message: "OTP has expired. Please request a new one." });
  }

  user.isVerified = true;
  user.verificationCode = undefined; // Remove verification code after successful verification

  await user.save();

  // Send JWT token
  sendToken(user, 200, res, "OTP verified successfully!");
});
const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, role, password } = req.body;
  if (!name || !email || !role || !password || !phone) {
    return next(new ErrorHandler("Please fill up the entire form"));
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return next(new ErrorHandler("Email already exist"));
  }

  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  const user = await User.create({
    name,
    email,
    role,
    phone,
    password,
    verificationCode: verificationCode,
    otpExpireAt: otpExpiry,
    isVerified: false,
  });
  await user.save();
  sendVerificationCode(email, verificationCode);

  sendToken(user, 200, res, "User registered successfully!");
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new ErrorHandler("Please provide all the details properly.", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  const isCorrectPassword = await user.comparePassword(password);
  if (!isCorrectPassword) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  if (!user.isVerified) {
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await User.findByIdAndUpdate(user._id, {
      verificationCode,
      otpExpireAt: otpExpiry,
    });

    sendVerificationCode(email, verificationCode);
    return res.status(400).json({
      message:
        "Please verify your email before logging in. OTP is sent to your email!",
      isVerified: false,
    });
  }

  sendToken(user, 200, res, "User login successfully!");
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User logged out successfully!",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  if (user.isVerified) {
    res.status(200).json({
      success: true,
      user,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "User is not verified",
    });
  }
});

export const getCustomers = catchAsyncError(async (req, res, next) => {
  const customers = await User.find({ role: "User" });

  if (!customers) {
    return next(new ErrorHandler("No Customers found!"));
  }

  res.status(200).json({
    success: true,
    customers,
  });
});

export const deleteCustomer = catchAsyncError(async (req, res, next) => {
  const { custId } = req.params;

  const customer = await User.findByIdAndDelete(custId);
  if (!customer) {
    return next(new ErrorHandler(`Customer with ID ${custId} not found!`, 404));
  }

  const deletedReviews = await Review.find({ userId: custId });
  const deletedReviewIds = deletedReviews.map((review) => review._id);
  await Review.deleteMany({ userId: custId });

  if (deletedReviewIds.length > 0) {
    const services = await Service.find({
      customerReviews: { $in: deletedReviewIds },
    });

    for (const service of services) {
      service.customerReviews = service.customerReviews.filter(
        (reviewId) => !deletedReviewIds.includes(reviewId)
      );

      const reviews = await Review.find({ serviceId: service._id });
      const totalRatings = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        reviews.length > 0 ? totalRatings / reviews.length : 0;

      service.customerRatings = averageRating;

      await service.save();
    }
  }

  res.status(200).json({
    success: true,
    message: "Customer and their reviews deleted successfully",
  });
});

export const getCustomerStatistics = catchAsyncError(async (req, res, next) => {
  const today = new Date();
  const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth() + 1, 1);

  const customerStats = await User.aggregate([
    {
      $match: {
        role: "User", // Filter only customers
        createdAt: { $gte: oneYearAgo }, // Filter for the last 12 months
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 }, // Count the users
      },
    },
  ]);

  // Generate labels and stats for the last 12 months in reverse order
  const stats = [];
  const labels = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // Find the stats for the current month and year
    const monthStat = customerStats.find(
      (stat) => stat._id.year === year && stat._id.month === month
    );

    // Add the month name and count to the respective arrays
    labels.unshift(
      date.toLocaleString("default", { month: "long" }) + ` ${year}`
    );
    stats.unshift(monthStat ? monthStat.count : 0);
  }

  res.status(200).json({
    success: true,
    labels,
    stats,
  });
});

export const forgotPassword = async (req, res) => {
  console.log("forgot password");

  try {
    let { email } = req.body;
    console.log(req.body);

    if (!email) {
      return res.status(401).json({ message: "email not found" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "user not exist!!!" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; //1h expiry
    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: '"BeautyBliss" <beautybliss.verify@gmail.com>',
      to: email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click the link below:</p>
                   <a href="${resetUrl}">${resetUrl}</a>
                   <p>This link is valid for 1 hour.</p>`,
    });

    res.status(200).json({ message: "reset link sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;
    const isequal = newPassword === confirmNewPassword;
    if (!isequal) {
      return res
        .status(400)
        .json({ message: "password and confirm password are not same!" });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: "password reset successfully " });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "server error", error });
  }
};

export const allCountList = catchAsyncError(async (req, res, next) => {
  const totalAppointments = await Appointment.countDocuments();
  const totalCustomers = await User.countDocuments({ role: "User" });
  const totalEmployees = await User.countDocuments({ role: "Employee" });
  const totalServices = await Service.countDocuments();
  const revenueResult = await Appointment.aggregate([
    {
      $match: { status: "Completed" }, // Only consider completed appointments
    },
    {
      $lookup: {
        from: "services", // Name of the Service collection
        localField: "serviceId",
        foreignField: "_id",
        as: "serviceDetails",
      },
    },
    {
      $unwind: "$serviceDetails", // Extract service details from array
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$serviceDetails.price" }, // Sum the price from service details
      },
    },
  ]);

  const totalRevenue =
    revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
  res.status(200).json({
    success: true,
    data: {
      totalAppointments,
      totalCustomers,
      totalEmployees,
      totalServices,
      totalRevenue,
    },
  });
});
