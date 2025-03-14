import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  image: {
    type: String, // Cloudinary image URL
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
