import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Service from "../models/serviceModel.js";
import Category from "./../models/categoryModel.js";
import fs from "fs";
import Review from "./../models/ReviewModel.js";
import Employee from "./../models/employeeModel.js";

export const postCategory = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;

  // Ensure both name and description are provided, along with the image URL from Cloudinary
  if (!name || !description) {
    return next(new ErrorHandler("Please provide all required details"));
  }

  // Check if an image is uploaded
  if (!req.file) {
    return next(new ErrorHandler("Image is required"));
  }

  const category = await Category.create({
    name,
    description,
    image: req.file.path, // Save the relative path of the image
  });
  res.status(200).json({
    success: true,
    message: "Category added successfully!",
    category,
  });
});

export const getCategories = catchAsyncError(async (req, res, next) => {
  const categories = await Category.find({});
  res.status(200).json({
    success: true,
    categories,
  });
});

export const getCategory = catchAsyncError(async (req, res, next) => {
  const category = await Category.find({ _id: req.params.cid });
  res.status(200).json({
    success: true,
    category,
  });
});

export const updateCategory = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;
  const { cid } = req.params;

  const category = await Category.findById(cid);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  if (req.file) {
    if (category.image) {
      fs.unlinkSync(category.image);
    }
    category.image = req.file.path;
  }

  if (name) category.name = name;
  if (description) category.description = description;

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

// export const deleteCategory = catchAsyncError(async (req, res, next) => {
//   const { cid } = req.params;
//   const category = await Category.findById(cid);

//   if (!category) {
//     return next(new ErrorHandler("Category not found", 404));
//   }

//   if (category.image) {
//     fs.unlink(category.image, (err) => {
//       if (err) {
//         console.error("Error deleting image:", err.message);
//       }
//     });
//   }
//   await Service.deleteMany({ categoryId: cid });
//   await Category.findByIdAndDelete(cid);

//   res.status(200).json({
//     success: true,
//     message: "Category and related services deleted successfully",
//   });
// });

export const deleteCategory = catchAsyncError(async (req, res, next) => {
  const { cid } = req.params;
  const category = await Category.findById(cid);
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  // Find all services related to the category
  const services = await Service.find({ categoryId: cid });

  if (services.length > 0) {
    // Delete reviews related to the services of this category
    const serviceIds = services.map((service) => service._id);
    await Review.deleteMany({ serviceId: { $in: serviceIds } });

    // Delete service images and remove references in `employee specialities`
    for (const service of services) {
      // Delete service image
      if (service.image) {
        fs.unlink(service.image, (err) => {
          if (err) {
            console.error(
              `Error deleting service image for service ${service._id}:`,
              err.message
            );
          }
        });
      }

      await Employee.updateMany(
        { speciality: service._id },
        { $pull: { speciality: service._id } }
      );
    }

    await Service.deleteMany({ categoryId: cid });
  }

  if (category.image) {
    fs.unlink(category.image, (err) => {
      if (err) {
        console.error("Error deleting category image:", err.message);
      }
    });
  }

  await Category.findByIdAndDelete(cid);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
