import Review from "../models/ReviewModel.js";
import Service from "../models/serviceModel.js";

export const addReview = async (req, res) => {
  const { serviceId, userId, rating, reviewContent } = req.body;

  // Step 1: Create a new review
  const newReview = await Review.create({
    serviceId,
    userId,
    rating,
    reviewContent,
  });

  // Populate user details in the review
  const populatedReview = await newReview.populate("userId", "name");

  // Step 2: Add the review to the service's reviews array
  const service = await Service.findById(serviceId);
  service.customerReviews.push(newReview._id);

  // Step 3: Recalculate the average rating
  const reviews = await Review.find({ serviceId }); // Find all reviews for the service
  const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRatings / reviews.length; // Calculate whole number average

  // Step 4: Update the Service model with the new average rating
  service.customerRatings = averageRating;
  await service.save();

  // Respond with success message and updated rating
  res.status(201).json({
    message: "Review added successfully!",
    review: populatedReview, // Return populated review
    averageRating,
  });
};
