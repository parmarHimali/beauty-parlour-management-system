import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (image == null) {
      toast.error("Image is required.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/category/create-category",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(data.message);
      setName("");
      setDescription("");
      setImage(null);
      navigateTo("/admin/category-list");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };
  return (
    <div className="form-section">
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="title">
          <h3>Add New Category</h3>
        </div>

        <div className="form-control">
          <label>Category Name</label>
          <div className="input-wrapper">
            <input
              type="text"
              name="category_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-control">
          <label>Category Description</label>
          <div className="input-wrapper">
            <textarea
              name="category_description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="form-control">
          <label>Image</label>
          <div className="input-wrapper">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-green" name="add_category">
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
