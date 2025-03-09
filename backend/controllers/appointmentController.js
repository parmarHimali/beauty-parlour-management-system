import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Service from "../models/serviceModel.js";
import Appointment from "./../models/appointmentModel.js";
import Employee from "./../models/employeeModel.js";

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

// export const bookAppointment = catchAsyncError(async (req, res) => {
//   const { serviceId, userId, phone, employeeId, date, time, customerName } =
//     req.body;

//   const service = await Service.findById(serviceId);
//   if (!service) {
//     return res.status(404).json({ message: "Service not found" });
//   }
//   const serviceDuration = service.duration; // Get duration from service

//   const employee = await Employee.findById(employeeId);
//   if (!employee) {
//     return res.status(404).json({ message: "Employee not found" });
//   }

//   const startTimeInMinutes = timeToMinutes(time);
//   const endTimeInMinutes = startTimeInMinutes + serviceDuration;

//   // Check if employee already has a booking for this date
//   let bookedForDate = employee.bookedTimes.find((entry) => entry.date === date);

//   if (bookedForDate) {
//     for (let bookedTime of bookedForDate.times) {
//       const [bookedStart, bookedEnd] = bookedTime.time
//         .split("-")
//         .map(timeToMinutes);

//       if (
//         (startTimeInMinutes >= bookedStart && startTimeInMinutes < bookedEnd) || // Starts inside
//         (endTimeInMinutes > bookedStart && endTimeInMinutes <= bookedEnd) || // Ends inside
//         (startTimeInMinutes <= bookedStart && endTimeInMinutes >= bookedEnd) // Fully overlaps
//       ) {
//         return res.status(400).json({
//           message: `Time slot overlaps with existing bookings, please select a different time.`,
//         });
//       }
//     }
//   }

//   const blockedTimes = [];
//   for (let i = startTimeInMinutes; i < endTimeInMinutes; i += serviceDuration) {
//     blockedTimes.push({
//       time: `${minutesToTime(i)}-${minutesToTime(i + serviceDuration)}`,
//       serviceId,
//       userId,
//       phone,
//     });
//   }

//   if (!bookedForDate) {
//     employee.bookedTimes.push({ date, times: blockedTimes });
//   } else {
//     bookedForDate.times.push(...blockedTimes);
//   }

//   await employee.save();

//   const appointment = new Appointment({
//     userId,
//     serviceId,
//     employeeId,
//     phone,
//     date,
//     time,
//     status: "Pending", // You can change the default status if needed
//     applyDate: new Date(),
//     customerName,
//   });

//   await appointment.save(); // Save the appointment

//   res
//     .status(201)
//     .json({ success: true, message: "Appointment booked successfully." });
// });
export const bookAppointment = catchAsyncError(async (req, res) => {
  const { serviceId, userId, phone, employeeId, date, time, customerName } =
    req.body;

  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }
  const serviceDuration = service.duration; // Get duration from service

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const startTimeInMinutes = timeToMinutes(time);
  const endTimeInMinutes = startTimeInMinutes + serviceDuration;
  const formattedTime = `${minutesToTime(startTimeInMinutes)}-${minutesToTime(
    endTimeInMinutes
  )}`;

  // Check if employee already has a booking for this date
  let bookedForDate = employee.bookedTimes.find((entry) => entry.date === date);

  if (bookedForDate) {
    for (let bookedTime of bookedForDate.times) {
      const [bookedStart, bookedEnd] = bookedTime.time
        .split("-")
        .map(timeToMinutes);

      if (
        (startTimeInMinutes >= bookedStart && startTimeInMinutes < bookedEnd) || // Starts inside
        (endTimeInMinutes > bookedStart && endTimeInMinutes <= bookedEnd) || // Ends inside
        (startTimeInMinutes <= bookedStart && endTimeInMinutes >= bookedEnd) // Fully overlaps
      ) {
        return res.status(400).json({
          message: `Time slot overlaps with existing bookings, please select a different time.`,
        });
      }
    }
  }

  const blockedTime = {
    time: formattedTime,
    serviceId,
    userId,
    phone,
  };

  if (!bookedForDate) {
    employee.bookedTimes.push({ date, times: [blockedTime] });
  } else {
    bookedForDate.times.push(blockedTime);
  }

  await employee.save();

  const appointment = new Appointment({
    userId,
    serviceId,
    employeeId,
    phone,
    date,
    time: formattedTime, // Store time in start-end format
    status: "Pending",
    applyDate: new Date(),
    customerName,
  });

  await appointment.save(); // Save the appointment

  res
    .status(201)
    .json({ success: true, message: "Appointment booked successfully." });
});

export const availableTimes = catchAsyncError(async (req, res) => {
  try {
    const { eid, date } = req.params;

    // Find employee by ID
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

    // Check if `bookedTimes` exists, default to empty array
    const bookedTimesEntry = employee.bookedTimes?.find(
      (entry) => new Date(entry.date).toISOString().split("T")[0] === date
    ) || { times: [] };

    const bookedTimes = bookedTimesEntry.times || [];

    // Function to convert time (HH:MM) to minutes
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + (minutes || 0);
    };

    // Ensure service duration is defined
    const serviceDuration = 60; // Default duration (1 hour)

    // Convert booked times to intervals
    const bookedIntervals = bookedTimes.map((range) => {
      const [start, end] = range.time.split("-").map(timeToMinutes);
      return { start, end };
    });

    // Filter available times
    const availableTimes = allTimes.filter((time) => {
      const timeInMinutes = timeToMinutes(time);
      const endInMinutes = timeInMinutes + serviceDuration;

      return !bookedIntervals.some(
        (interval) =>
          (timeInMinutes >= interval.start && timeInMinutes < interval.end) || // Starts inside booked range
          (endInMinutes > interval.start && endInMinutes <= interval.end) || // Ends inside booked range
          (timeInMinutes <= interval.start && endInMinutes >= interval.end) // Fully overlaps booked range
      );
    });

    res.status(200).json({
      success: true,
      availableTimes,
    });
  } catch (error) {
    console.error("Error fetching available times:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const bookedTimes = catchAsyncError(async (req, res, next) => {
  const { eid, date } = req.params;

  if (!eid || !date) {
    return next(new ErrorHandler("Employee ID and date are required!", 400));
  }

  const employee = await Employee.findById(eid);
  if (!employee) {
    return next(new ErrorHandler("Employee not found!", 404));
  }

  // Find bookings for the requested date
  const bookedForDate = employee.bookedTimes.find(
    (entry) => entry.date === date
  );
  const bookedTimes = bookedForDate ? bookedForDate.times : [];

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
    return res.status(400).json({ message: "No booked appointments found." });
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
export const allAppChart = catchAsyncError(async (req, res, next) => {
  try {
    const employees = await Employee.find().populate("userId", "name");

    let appointmentData = [];
    let statusCount = { completed: 0, pending: 0, canceled: 0 };

    employees.forEach((employee) => {
      const totalAppointments = employee.bookedTimes.reduce(
        (sum, bt) => sum + bt.times.length,
        0
      );

      employee.bookedTimes.forEach((bt) => {
        bt.times.forEach((appt) => {
          statusCount[appt.status] = (statusCount[appt.status] || 0) + 1;
        });
      });

      appointmentData.push({
        name: employee.userId.name,
        totalAppointments,
      });
    });
    res.status(200).json({ appointmentData, statusCount });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// export const deleteAppointment = catchAsyncError(async (req, res) => {
//   const { appointmentId } = req.params;

//   const appointment = await Appointment.findById(appointmentId);
//   if (!appointment) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Appointment not found" });
//   }

//   // Remove the booked time slot from the employee's schedule
//   const employee = await Employee.findById(appointment.employeeId);
//   if (!employee) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Employee not found" });
//   }

//   // Use $pull to remove the specific time slot from bookedTimes
//   await Employee.updateOne(
//     { _id: appointment.employeeId, "bookedTimes.date": appointment.date },
//     { $pull: { "bookedTimes.$.times": { time: appointment.time } } }
//   );

//   // Remove any empty bookedTimes entry (if all times were removed)
//   await Employee.updateOne(
//     { _id: appointment.employeeId },
//     { $pull: { bookedTimes: { times: { $size: 0 } } } }
//   );

//   // Delete the appointment
//   await Appointment.findByIdAndDelete(appointmentId);

//   res
//     .status(200)
//     .json({ success: true, message: "Appointment deleted successfully." });
// });
export const deleteAppointment = catchAsyncError(async (req, res) => {
  const { appointmentId } = req.params;

  // Find the appointment
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  const { employeeId, date, time } = appointment;

  // Find the employee
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  // Remove the booked time from employee's bookedTimes
  let bookedForDate = employee.bookedTimes.find((entry) => entry.date === date);
  if (bookedForDate) {
    bookedForDate.times = bookedForDate.times.filter(
      (slot) => slot.time !== time
    );

    // If no more times remain for the date, remove the date entry
    if (bookedForDate.times.length === 0) {
      employee.bookedTimes = employee.bookedTimes.filter(
        (entry) => entry.date !== date
      );
    }

    await employee.save();
  }

  // Delete the appointment
  await Appointment.findByIdAndDelete(appointmentId);

  res
    .status(200)
    .json({ success: true, message: "Appointment deleted successfully." });
});
