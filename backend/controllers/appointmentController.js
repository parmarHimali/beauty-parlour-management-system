import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Service from "../models/serviceModel.js";
import Appointment from "./../models/appointmentModel.js";
import Employee from "./../models/employeeModel.js";
import User from "./../models/userModel.js";

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Function to convert minutes to time string (HH:MM)
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export const bookAppointment = catchAsyncError(async (req, res, next) => {
  const { serviceId, categoryId, userId, phone, employeeId, date, time } =
    req.body;

  if (
    !userId ||
    !phone ||
    !serviceId ||
    !employeeId ||
    !date ||
    !time
    // !categoryId
  ) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    return next(new ErrorHandler("Service not found", 404));
  }
  const serviceDuration = service.duration;
  const timeParts = time.split(":");
  if (timeParts.length !== 2) {
    return next(new ErrorHandler("Invalid start time format", 400));
  }

  const [hours, minutes] = timeParts.map(Number);
  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return next(new ErrorHandler("Invalid start time format", 400));
  }

  const startTimeInMinutes = timeToMinutes(time);

  const blockedTimes = [];
  for (let i = 0; i < serviceDuration; i += 60) {
    blockedTimes.push(minutesToTime(startTimeInMinutes + i));
  }
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler("Customer not found", 404));
  }

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  const bookedForDate = employee.bookedTimes.find((b) => b.date === date);
  if (bookedForDate) {
    for (let t of blockedTimes) {
      if (bookedForDate.times.includes(t)) {
        return res
          .status(400)
          .json({ message: `Time slot at ${t} is already booked` });
      }
    }
  }

  const newAppointment = new Appointment({
    userId,
    serviceId,
    employeeId,
    date,
    time,
    // categoryId,
    phone,
  });

  await newAppointment.save();
  console.log(newAppointment);

  if (!bookedForDate) {
    employee.bookedTimes.push({ date, times: blockedTimes });
  } else {
    bookedForDate.times.push(...blockedTimes);
  }
  await employee.save();

  res
    .status(201)
    .json({ success: true, message: "Appointment booked successfully!" });
});

export const availableTimes = async (req, res) => {
  const { eid, date } = req.params;

  const employee = await Employee.findById(eid);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const allTimes = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const bookedTimesEntry = employee.bookedTimes.find(
    (entry) => entry.date === date
  );
  const bookedTimes = bookedTimesEntry ? bookedTimesEntry.times : [];

  const availableTimes = allTimes.filter((time) => !bookedTimes.includes(time));

  res.status(200).json({
    success: true,
    availableTimes,
  });
};

export const bookedTimes = catchAsyncError(async (req, res, next) => {
  const { eid, date } = req.params;
  if (!eid || !date) {
    return next(new ErrorHandler("Employee ID and date are required!", 404));
  }

  const employee = await Employee.findById(eid);

  if (!employee) {
    return next(new ErrorHandler("Employee not found!", 404));
  }

  const bookedTimes = employee.bookedTimes;
  res.status(200).json({
    success: true,
    bookedTimes,
  });
});

export const getAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await Appointment.find()
    .populate("userId", "name email phone") // Populate customer info
    .populate("serviceId", "name price duration") // Populate service details
    .populate({
      path: "employeeId", // Populate employeeId field
      select: "userId", // Only select the userId field inside employeeId
      populate: {
        path: "userId", // Populate userId to get the actual user details
        select: "name email phone", // Select the fields you want from the User collection
      },
    })
    .exec();

  if (!appointments.length) {
    return res.status(404).json({ message: "No booked appointments found." });
  }

  // Map the appointments to the desired format
  const response = appointments.map((appointment) => {
    const {
      _id,
      userId,
      serviceId,
      employeeId,
      customerName,
      phone,
      date,
      time,
      status,
      applyDate,
    } = appointment;

    return {
      appointmentId: _id,
      customerName: userId ? userId.name : customerName, // Use the customer's name or fallback to customerName
      customerEmail: userId ? userId.email : "N/A", // Fallback email if userId is not available
      customerPhone: phone,
      serviceName: serviceId ? serviceId.name : "Unknown Service",
      serviceDuration: serviceId ? serviceId.duration : "N/A",
      servicePrice: serviceId ? serviceId.price : "N/A",
      employeeName: employeeId ? employeeId.userId.name : "Unknown Employee",
      employeeEmail: employeeId ? employeeId.userId.email : "N/A",
      employeePhone: employeeId ? employeeId.userId.phone : "N/A",
      date,
      time,
      applyDate,
      status,
      userId,
    };
  });

  res.status(200).json({
    success: true,
    allAppointments: response,
  });
});

export const getTodayAppointments = catchAsyncError(async (req, res, next) => {
  const appointments = await Appointment.find({
    date: new Date().toISOString().split("T")[0],
  })
    .populate("userId", "name email phone") // Populate customer info
    .populate("serviceId", "name price duration") // Populate service details
    .populate({
      path: "employeeId", // Populate employeeId field
      select: "userId", // Only select the userId field inside employeeId
      populate: {
        path: "userId", // Populate userId to get the actual user details
        select: "name email phone", // Select the fields you want from the User collection
      },
    })
    .exec();

  if (!appointments.length) {
    return res.status(404).json({ message: "No booked appointments found." });
  }

  // Map the appointments to the desired format
  const response = appointments.map((appointment) => {
    const {
      _id,
      userId,
      serviceId,
      employeeId,
      customerName,
      phone,
      date,
      time,
      status,
    } = appointment;

    return {
      appointmentId: _id,
      customerName: userId ? userId.name : customerName, // Use the customer's name or fallback to customerName
      customerEmail: userId ? userId.email : "N/A", // Fallback email if userId is not available
      customerPhone: phone,
      serviceName: serviceId ? serviceId.name : "Unknown Service",
      serviceDuration: serviceId ? serviceId.duration : "N/A",
      servicePrice: serviceId ? serviceId.price : "N/A",
      employeeName: employeeId ? employeeId.userId.name : "Unknown Employee",
      employeeEmail: employeeId ? employeeId.userId.email : "N/A",
      employeePhone: employeeId ? employeeId.userId.phone : "N/A",
      date,
      time,
      userId,
      status,
    };
  });

  res.status(200).json({
    success: true,
    allAppointments: response,
  });
});

export const getEmployeeAppointments = catchAsyncError(
  async (req, res, next) => {
    const employeeId = req.user._id; // Get logged-in employee ID
    const appointments = await Appointment.find({ employeeId }).populate(
      "customerId serviceId"
    );

    res.status(200).json({ success: true, appointments });
  }
);

export const getAllForEmployee = catchAsyncError(async (req, res, next) => {
  const { uid } = req.params; // userId instead of employeeId
  console.log("User ID:", uid);

  // Find employee document using the userId
  const employee = await Employee.findOne({ userId: uid });
  if (!employee) {
    return res
      .status(404)
      .json({ success: false, message: "Employee not found." });
  }

  // Fetch appointments using the employeeId from the Employee model
  const appointments = await Appointment.find({ employeeId: employee._id })
    .populate("categoryId", "name") // Get category name
    .populate("serviceId", "name price duration") // Get service details
    .populate({
      path: "employeeId",
      populate: {
        path: "userId",
        select: "name email phone",
      },
    }) // Get employee's user details
    .populate("userId", "name email phone"); // Get customer's details

  if (!appointments.length) {
    return res
      .status(404)
      .json({ success: false, message: "No appointments found." });
  }

  res.json({ success: true, appointments });
});

export const statusChange = catchAsyncError(async (req, res, next) => {
  const { status } = req.body;
  const { aid } = req.params;

  const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid status value", 400));
  }

  const appointment = await Appointment.findByIdAndUpdate(
    aid,
    { status },
    { new: true }
  );

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  res.status(200).json({ message: "Status updated successfully", appointment });
});

// charts
export const appointmentStats = catchAsyncError(async (req, res, next) => {
  try {
    const stats = await Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error!" });
  }
});

export const monthlyChart = catchAsyncError(async (req, res, next) => {
  try {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    const monthlyData = await Appointment.aggregate([
      {
        $match: {
          applyDate: { $gte: lastYear, $lte: today }, // Get last 12 months
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$applyDate" },
            year: { $year: "$applyDate" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort: oldest to latest
    ]);

    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error!" });
  }
});

export const currMonthChart = catchAsyncError(async (req, res, next) => {
  try {
    const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
    const currentYear = new Date().getFullYear();

    const appointments = await Appointment.aggregate([
      {
        $match: {
          date: { $regex: `^${currentYear}-0?${currentMonth}-` }, // Match YYYY-MM format
        },
      },
      {
        $group: {
          _id: "$date", // Group by date
          count: { $sum: 1 }, // Count appointments
        },
      },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error });
  }
});
