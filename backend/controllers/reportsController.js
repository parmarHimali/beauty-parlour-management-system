import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Appointment from "./../models/appointmentModel.js";

export const salesReport = catchAsyncError(async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = { status: "Completed" };
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const appointments = await Appointment.find(filter).populate(
      "serviceId",
      "price name"
    );

    let totalRevenue = 0;
    let serviceReport = {}; // Stores revenue & booking count per service

    appointments.forEach((appt) => {
      const serviceName = appt.serviceId.name;
      const price = appt.serviceId.price;

      if (!serviceReport[serviceName]) {
        serviceReport[serviceName] = { revenue: 0, bookings: 0 };
      }

      serviceReport[serviceName].revenue += price;
      serviceReport[serviceName].bookings += 1;
      totalRevenue += price;
    });

    // Convert serviceReport object to array
    const reportData = Object.keys(serviceReport).map((service) => ({
      service,
      revenue: serviceReport[service].revenue,
      bookings: serviceReport[service].bookings,
    }));

    res.json({ totalRevenue, reportData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// export const monthlySalesReport = catchAsyncError(async (req, res, next) => {
//   try {
//     const appointments = await Appointment.aggregate([
//       {
//         $match: { status: "Completed" }, // Only count completed appointments
//       },
//       {
//         $lookup: {
//           from: "services",
//           localField: "serviceId",
//           foreignField: "_id",
//           as: "service",
//         },
//       },
//       { $unwind: "$service" },
//       {
//         $group: {
//           _id: { $substr: ["$date", 0, 7] }, // Extract YYYY-MM
//           totalRevenue: { $sum: "$service.price" },
//           bookings: { $sum: 1 },
//         },
//       },
//       { $sort: { _id: 1 } }, // Sort by month
//     ]);

//     res.json({ monthlyReport: appointments });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
export const monthlySalesReport = catchAsyncError(async (req, res, next) => {
  try {
    const appointments = await Appointment.aggregate([
      {
        $match: { status: "Completed" }, // Only count completed appointments
      },
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $group: {
          _id: {
            month: { $substr: ["$date", 0, 7] }, // Extract YYYY-MM
            service: "$service.name",
          },
          totalRevenue: { $sum: "$service.price" },
          bookings: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          services: {
            $push: {
              service: "$_id.service",
              bookings: "$bookings",
              revenue: "$totalRevenue",
            },
          },
          totalRevenue: { $sum: "$totalRevenue" },
          totalBookings: { $sum: "$bookings" },
        },
      },
      { $sort: { _id: 1 } }, // Sort by month
    ]);

    res.json({ monthlyReport: appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
