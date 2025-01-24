import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service", // Reference to the Service being reviewed
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who wrote the review (optional)
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  reviewContent: {
    type: String,
    required: true,
    minlength: [10, "review content must be 10 characters long"],
    maxlength: [500, "review content cannot exceed 100 characters"],
  },
  reviewDate: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
