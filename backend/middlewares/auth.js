import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const isAuthorized = catchAsyncError(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ErrorHandler("User not authorized", 400));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorHandler("user not found", 404));
    }
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    // return next(new ErrorHandler("User not authorized", 400));
    return next(new ErrorHandler("Invalid token", 400));
  }
});
