import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Review from "../models/ReviewModel.js";
import Service from "../models/serviceModel.js";
import User from "../models/userModel.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, role, password } = req.body;
  if (!name || !email || !role || !password || !phone) {
    return next(new ErrorHandler("Please fill up the entire form"));
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return next(new ErrorHandler("Email already exist"));
  }

  const user = await User.create({
    name,
    email,
    role,
    phone,
    password,
  });

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
  res.status(200).json({
    success: true,
    user,
  });
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

  // Step 1: Find and delete the customer
  const customer = await User.findByIdAndDelete(custId);
  if (!customer) {
    return next(new ErrorHandler(`Customer with ID ${custId} not found!`, 404));
  }

  // Step 2: Find and delete all reviews associated with the customer
  const deletedReviews = await Review.find({ userId: custId });
  const deletedReviewIds = deletedReviews.map((review) => review._id);
  await Review.deleteMany({ userId: custId });

  // Step 3: Update the service documents that still reference the deleted reviews
  if (deletedReviewIds.length > 0) {
    const services = await Service.find({
      customerReviews: { $in: deletedReviewIds },
    });

    for (const service of services) {
      // Remove the deleted reviews from the service's customerReviews array
      service.customerReviews = service.customerReviews.filter(
        (reviewId) => !deletedReviewIds.includes(reviewId)
      );

      // Recalculate the average rating based on the remaining reviews
      const reviews = await Review.find({ serviceId: service._id });
      const totalRatings = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        reviews.length > 0 ? totalRatings / reviews.length : 0;

      // Update the service's customerRatings field with the new average rating
      service.customerRatings = averageRating;

      // Save the updated service document
      await service.save();
    }
  }

  // Step 4: Respond with success message
  res.status(200).json({
    success: true,
    message: "Customer and their reviews deleted successfully",
  });
});

// export const getCustomerStatistics = catchAsyncError(async (req, res, next) => {
//   const customerStats = await User.aggregate([
//     {
//       $match: { role: "User" }, // Only consider customers
//     },
//     {
//       $group: {
//         _id: { $month: "$createdAt" }, // Group by month
//         count: { $sum: 1 }, // Count customers
//       },
//     },
//     {
//       $sort: { _id: 1 }, // Sort by month
//     },
//   ]);

//   const stats = Array.from({ length: 12 }, (_, index) => {
//     const monthStat = customerStats.find((stat) => stat._id === index + 1);
//     return monthStat ? monthStat.count : 0;
//   });

//   res.status(200).json({
//     success: true,
//     stats,
//   });
// });

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
