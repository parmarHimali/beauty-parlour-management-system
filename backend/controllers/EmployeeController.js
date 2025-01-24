import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Employee from "../models/employeeModel.js";
import User from "../models/userModel.js";
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

export const employeeByService = catchAsyncError(async (req, res, next) => {
  const { sid } = req.params;
  console.log("service id  ", sid);
  const employees = await Employee.find({
    speciality: { $in: [sid] },
  })
    .populate("speciality", "name")
    .populate("userId", "name");
  employees;

  if (employees.length === 0) {
    return res
      .status(404)
      .json({ message: "No employees found for this service" });
  }
  const employeeList = employees.map((employee) => employee.userId);

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
