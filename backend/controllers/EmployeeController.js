import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Employee from "../models/employeeModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
export const addEmployee = catchAsyncError(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    password,
    speciality,
    experience,
    position,
    salary,
    // availableTimes,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !email ||
    !password ||
    !phone ||
    !Array.isArray(speciality) ||
    !experience ||
    !position ||
    !salary
  ) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // Check if the email already exists
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  // Create a new user with the role of Employee
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: "Employee",
    // Fixed role as Employee
  });

  // Create a new employee profile linked to the user
  const employee = await Employee.create({
    userId: user._id,
    speciality,
    experience,
    position,
    salary,
  });

  res.status(201).json({
    success: true,
    message: "Employee added successfully",
    user,
    employee,
  });
});

// export const employeeByService = catchAsyncError(async (req, res, next) => {
//   const { sid } = req.params;
//   console.log("service id  ", sid);
//   const employees = await Employee.find({
//     speciality: { $in: [sid] },
//   })
//     .populate("speciality")
//     .populate("userId", "name");

//   console.log(employees);

//   if (employees.length === 0) {
//     return res
//       .status(404)
//       .json({ message: "No employees found for this service" });
//   }
//   const employeeList = employees.map((employee) => employee.userId);

//   res.status(200).json({
//     success: true,
//     employees,
//   });
// });

export const employeeByService = catchAsyncError(async (req, res, next) => {
  const { sid } = req.params;
  if (!mongoose.Types.ObjectId.isValid(sid)) {
    return res.status(400).json({ message: "Invalid service ID" });
  }

  // console.log("Service ID:", sid);

  const employees = await Employee.find({
    speciality: { $in: [new mongoose.Types.ObjectId(sid)] },
  })
    .populate("speciality")
    .populate("userId", "name");

  // console.log(employees);

  if (employees.length === 0) {
    return res
      .status(404)
      .json({ message: "No employees found for this service" });
  }

  res.status(200).json({
    success: true,
    employees,
  });
});

export const getEmployees = catchAsyncError(async (req, res, next) => {
  const employees = await Employee.find({})
    .populate("userId", "name email phone role createdAt") // Populate user details (name, email, phone, role)
    .populate("speciality", "name description"); // Populate speciality details (e.g., name, description of services)

  if (employees.length === 0) {
    return next(new ErrorHandler("No employees found!"));
  }

  res.status(200).json({
    success: true,
    employees,
  });
});
export const deleteEmployee = catchAsyncError(async (req, res, next) => {
  const { eid } = req.params;

  // Find the employee by ID
  const employee = await Employee.findById(eid);
  if (!employee) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  // Delete the employee document
  await Employee.findByIdAndDelete(eid);

  // Also delete the user associated with the employee
  await User.findByIdAndDelete(employee.userId);

  res.status(200).json({
    success: true,
    message: "Employee deleted successfully",
  });
});

export const getEmployeeSpeciality = catchAsyncError(async (req, res, next) => {
  // console.log(req.user);
  // const userId = req.user._id;
  const { uid } = req.params;
  const employee = await Employee.findOne({ userId: uid }).populate(
    "speciality"
  );
  // console.log(employee);

  if (!employee) {
    return next(new ErrorHandler("Employee not found!", 404));
  }

  return res.status(200).json({
    success: true,
    employee,
  });
});

export const profile = catchAsyncError(async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user._id })
      .populate("userId", "name email phone") // Populating user details
      .populate("speciality", "name price"); // Populating services

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export const photoChange = catchAsyncError(async (req, res, next) => {
  // console.log("skajdnjn");

  try {
    // console.log("File received:", req.file); // Debugging
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { photo: `/uploads/${req.file.filename}` },
      { new: true }
    ).select("photo");

    res.json({ message: "Profile photo updated!", photo: updatedUser.photo });
  } catch (error) {
    console.error("Server error:", error); // Debugging
    res.status(500).json({ error: "Failed to update profile photo" });
  }
});
