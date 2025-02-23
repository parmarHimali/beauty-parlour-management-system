import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Foreign key to Category
    required: true,
  },
  image: {
    type: String, // Main display image
    required: true,
  },
  // employeeImages: {
  //   type: [String], // Array for images uploaded by employees
  //   default: [],
  // },
  employeeImages: [
    {
      imageUrl: { type: String, required: true }, // Image path
      employeeName: { type: String, required: true }, // Name of uploader
    },
  ],

  serviceHighlights: {
    type: [String], // Array to store multiple highlights as bullet points
    required: true,
  },
  customerRatings: {
    type: Number, // Average customer rating
    min: 0,
    max: 5,
    default: 0,
  },
  customerReviews: {
    type: [mongoose.Schema.Types.ObjectId], // Array of Review references
    ref: "Review", // Reference to the Review model
    default: [],
  },
  discountOffer: {
    type: String, // e.g., '10% Off Today Only!'
    default: null,
  },
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
