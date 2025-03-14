import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Employee from "../models/employeeModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Appointment from "../models/appointmentModel.js";
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
    isVerified: true,
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
  const { uid } = req.params;
  const employee = await Employee.findOne({ userId: uid }).populate(
    "speciality"
  );

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

export const updateEmployeeImage = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found!" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided!" });
    }
    const employeesFolder = path.join("uploads", "employees");
    if (!fs.existsSync(employeesFolder)) {
      fs.mkdirSync(employeesFolder, { recursive: true });
    }

    // Define new file path in /uploads/employees
    const newFilePath = path.join(employeesFolder, req.file.filename);
    // Move to /uploads/employees
    fs.renameSync(req.file.path, newFilePath);

    // Delete old image if it exists
    if (employee.image && typeof employee.image === "string") {
      const oldImagePath = path.join(
        "uploads/employees",
        path.basename(employee.image)
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    // Update employee image path in database
    employee.image = `/uploads/employees/${req.file.filename}`;
    await employee.save();

    res
      .status(200)
      .json({ message: "Profile updated successfully!", employee });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

export const empChart = catchAsyncError(async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received userId:", userId);

    // Find the employee from the given userId
    const employee = await Employee.findOne({ userId: userId });
    console.log("Found Employee:", employee);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch all appointments for this employee & populate the service name
    const appointments = await Appointment.find({
      employeeId: employee._id,
    }).populate("serviceId", "name"); // Populate serviceId and return only the 'name' field

    // Initialize statistics
    const appointmentsByDate = {};
    const servicesCount = {};
    const statusCount = {
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
    };

    // Process appointments
    appointments.forEach(({ date, serviceId, status }) => {
      // Count by date
      appointmentsByDate[date] = (appointmentsByDate[date] || 0) + 1;

      // Count services by name instead of ID
      const serviceName = serviceId?.name || "Unknown Service";
      servicesCount[serviceName] = (servicesCount[serviceName] || 0) + 1;

      // Count status
      statusCount[status] += 1;
    });

    res.json({
      appointmentsByDate,
      servicesCount,
      statusCount,
    });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export const calender = catchAsyncError(async (req, res, next) => {
  try {
    const { uid } = req.params;

    const employee = await Employee.findOne({ userId: uid });
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    const appointments = await Appointment.find({
      employeeId: employee._id,
    })
      .populate("serviceId", "name")
      .populate("userId", "name");
    console.log(appointments);

    const events = appointments.map((appt) => ({
      id: appt._id,
      title: `${appt.customerName || appt.userId?.name} - ${
        appt.serviceId.name
      }`,
      start: `${appt.date}T${appt.time}`, // Format: YYYY-MM-DDTHH:mm
      extendedProps: {
        phone: appt.phone,
        status: appt.status,
        service: appt.serviceId.name,
        customer: appt.customerName || appt.userId?.name,
      },
    }));

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Error fetching calendar:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching appointments" });
  }
});
