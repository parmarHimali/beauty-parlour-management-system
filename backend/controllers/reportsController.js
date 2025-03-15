import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Appointment from "./../models/appointmentModel.js";
export const salesReport = catchAsyncError(async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = { status: "Completed" };
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    // Fetch appointments with service details
    const appointments = await Appointment.find(filter).populate(
      "serviceId",
      "price name"
    );

    let totalRevenue = 0;
    let serviceReport = {}; // Stores revenue & booking count per service

    appointments.forEach((appt) => {
      const serviceName = appt.serviceId.name;
      const originalPrice = appt.serviceId.price;
      const priceAtBooking = appt.priceAtBooking ?? originalPrice; // Use priceAtBooking if available, otherwise service price
      const discount = appt.discountApplied ?? 0; // Default discount to 0 if not available

      // Apply discount calculation
      const finalPrice = Math.max(
        priceAtBooking - (priceAtBooking * discount) / 100,
        0
      ); // Ensures price is never negative

      if (!serviceReport[serviceName]) {
        serviceReport[serviceName] = { revenue: 0, bookings: 0 };
      }

      serviceReport[serviceName].revenue += finalPrice;
      serviceReport[serviceName].bookings += 1;
      totalRevenue += finalPrice;
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
        $project: {
          month: { $substr: ["$date", 0, 7] }, // Extract YYYY-MM
          serviceName: "$service.name",
          actualPrice: "$service.price",
          priceAtBooking: { $ifNull: ["$priceAtBooking", "$service.price"] }, // Use priceAtBooking if available, otherwise use service price
          discountApplied: { $ifNull: ["$discountApplied", 0] }, // Default to 0 if discount is not applied
        },
      },
      {
        $project: {
          month: 1,
          serviceName: 1,
          finalPrice: {
            $max: [
              {
                $subtract: [
                  "$priceAtBooking",
                  {
                    $multiply: [
                      "$priceAtBooking",
                      { $divide: ["$discountApplied", 100] },
                    ],
                  },
                ],
              },
              0, // Ensure price is never negative
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$month",
            service: "$serviceName",
          },
          totalRevenue: { $sum: "$finalPrice" }, // Sum of discounted prices
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
