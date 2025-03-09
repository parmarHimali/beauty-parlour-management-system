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
    maxlength: 200,
  },
  image: {
    type: String, // Cloudinary image URL
  },
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
