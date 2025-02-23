import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Review from "../models/ReviewModel.js";
import fs from "fs";
import Service from "../models/serviceModel.js";
import Employee from "../models/employeeModel.js";

// Add a new service
export const addService = catchAsyncError(async (req, res, next) => {
  const { categoryId, name, description, price, duration, serviceHighlights } =
    req.body;

  if (
    !categoryId ||
    !name ||
    !description ||
    !price ||
    !duration ||
    !serviceHighlights
  ) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // Split the serviceHighlights string into an array by newline
  const highlightsArray = serviceHighlights
    .split("\n")
    .map((highlight) => highlight.trim())
    .filter((highlight) => highlight);

  if (highlightsArray.length === 0) {
    return next(new ErrorHandler("Service highlights cannot be empty", 400));
  }

  if (!req.file) {
    return next(new ErrorHandler("Image is required", 400));
  }

  const image = req.file.path;

  const service = await Service.create({
    categoryId,
    name,
    description,
    price,
    duration,
    image,
    serviceHighlights: highlightsArray,
  });

  res.status(200).json({
    success: true,
    message: "Service added successfully!",
    service,
  });
});

// Fetch services by category
export const fetchServices = catchAsyncError(async (req, res, next) => {
  const { cid } = req.params;
  const services = await Service.find({ categoryId: cid });

  if (!services || services.length === 0) {
    return next(new ErrorHandler("No service found for this category", 404));
  }

  res.status(200).json({
    success: true,
    services,
  });
});
export const fetchService = async (req, res, next) => {
  const { sid } = req.params;

  const service = await Service.findById(sid).lean(); // Convert to plain object

  if (!service) {
    return next(new ErrorHandler("Service not found!", 404));
  }

  // Fetch reviews for the service and populate user details
  const reviews = await Review.find({ serviceId: sid })
    .populate({
      path: "userId",
      select: "name email",
    })
    .lean();
  service.customerReviews = reviews;

  res.status(200).json({
    success: true,
    service,
  });
};

export const addToGallery = catchAsyncError(async (req, res, next) => {
  const { sid } = req.params;
  console.log("add photo to gallery", sid);

  if (!req.file) {
    return next(new ErrorHandler("There is No file selected to upload"), 404);
  }
  const service = await Service.findById(sid);
  if (!service) {
    return next(new ErrorHandler("Service not found!"), 404);
  }
  if (!req.user) {
    return next(new ErrorHandler("Unauthorized access!", 401));
  }
  console.log(req.file);

  const employeeName = req.user.name;
  console.log(sid);
  console.log(service);

  // service.employeeImages.push(`uploads/${req.file.filename}`);
  service.employeeImages.push({
    imageUrl: `uploads/${req.file.filename}`,
    employeeName,
  });

  await service.save();
  const uploadedImages = service.employeeImages;

  res.status(200).json({
    success: true,
    message: "Photo uploaded to gallery!",
    uploadedImages,
  });
});

export const getAllService = catchAsyncError(async (req, res, next) => {
  const services = await Service.find({});
  if (services.length == 0) {
    return next(new ErrorHandler("No Service available!", 400));
  }
  res.status(200).json({
    success: true,
    services,
  });
});

export const deleteService = catchAsyncError(async (req, res, next) => {
  const { sid } = req.params;

  const service = await Service.findById(sid);

  if (!service) {
    return next(new ErrorHandler("Service not found!", 404));
  }

  if (service.image) {
    console.log("Attempting to delete file at:", service.image); // Log path
    fs.unlink(service.image, (err) => {
      if (err) {
        console.error("Failed to delete service image:", err);
      }
    });
  }

  await Review.deleteMany({ serviceId: sid });
  await Employee.updateMany(
    { speciality: sid },
    { $pull: { speciality: sid } }
  );
  await Service.deleteOne({ _id: sid });

  res.status(200).json({
    success: true,
    message: "Service deleted successfully!",
  });
});

export const updateService = catchAsyncError(async (req, res, next) => {
  const { sid } = req.params;
  const { categoryId, name, description, price, duration, serviceHighlights } =
    req.body;

  const service = await Service.findById(sid);

  if (!service) {
    return next(new ErrorHandler("Service not found!", 404));
  }

  // Update service details
  if (categoryId) service.categoryId = categoryId;
  if (name) service.name = name;
  if (description) service.description = description;
  if (price) service.price = price;
  if (duration) service.duration = duration;

  // Update service highlights if provided
  if (serviceHighlights) {
    const highlightsArray = serviceHighlights
      .split("\n")
      .map((highlight) => highlight.trim())
      .filter((highlight) => highlight);

    if (highlightsArray.length === 0) {
      return next(new ErrorHandler("Service highlights cannot be empty", 400));
    }
    service.serviceHighlights = highlightsArray;
  }

  // Update image if a new file is uploaded
  if (req.file) {
    // Remove old image
    if (service.image) {
      fs.unlink(service.image, (err) => {
        if (err) console.error("Failed to delete old service image:", err);
      });
    }
    service.image = req.file.path;
  }

  await service.save();

  res.status(200).json({
    success: true,
    message: "Service updated successfully!",
    service,
  });
});
