import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const EditCategory = () => {
  const { cid } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/category/${cid}`
        );
        setCategory(data.category[0]);
        setFormData({
          name: data.category[0].name,
          description: data.category[0].description,
        });
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };
    fetchCategory();
  }, [cid]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = new FormData();
      updateData.append("name", formData.name);
      updateData.append("description", formData.description);
      if (formData.image) updateData.append("image", formData.image);

      await axios.put(
        `http://localhost:4000/api/category/update/${cid}`,
        updateData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Category updated successfully!");
      navigate("/admin/category-list");
    } catch (error) {
      console.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleNavigate = (url) => {
    window.open(url, "_blank");
  };
  return (
    <div className="form-section">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="title">
          <h3>Edit Category</h3>
        </div>

        <div className="form-control">
          <label>Category Name</label>
          <div className="input-wrapper">
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-control">
          <label>Category Description</label>
          <div className="input-wrapper">
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="form-control">
          <label>Image</label>
          <div className="input-wrapper two-control">
            <div style={{ flexBasis: "120%" }}>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              <p>Current Image: </p>
            </div>
            <div>
              {category.image && (
                <img
                  src={`http://localhost:4000/${category.image}`}
                  alt="Category Image"
                  width="100"
                  onClick={() =>
                    handleNavigate(`http://localhost:4000/${category.image}`)
                  }
                />
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-green">
          Update Category
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
