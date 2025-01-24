import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddService = () => {
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [serviceHighlights, setServiceHighlights] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/category/all-categories"
        );
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Image is required.");
      return;
    }

    const formData = new FormData();
    formData.append("categoryId", categoryId);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("duration", duration);
    formData.append("serviceHighlights", serviceHighlights);
    formData.append("image", image);
    console.log(formData);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/services/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(data.message);
      setCategoryId("");
      setName("");
      setDescription("");
      setPrice("");
      setDuration("");
      setServiceHighlights("");
      setImage(null);
      navigateTo(`/admin/see-more/${data.service._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="form-section">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={{ width: "40%", marginTop: "25px", marginBottom: "30px" }}
      >
        <div className="title">
          <h3>Add New Service</h3>
        </div>
        {/* <div className="form-control">
          <label>Category</label>
          <div className="input-wrapper">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cate) => (
                <option key={cate._id} value={cate._id}>
                  {cate.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-control">
          <label>Service Name</label>
          <div className="input-wrapper">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div> */}
        <div className="form-control two-control">
          <div>
            <label>Category</label>
            <div className="input-wrapper">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cate) => (
                  <option key={cate._id} value={cate._id}>
                    {cate.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label>Service Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-control">
          <label>Service Description</label>
          <div className="input-wrapper">
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
        </div>
        <div className="form-control two-control">
          <div>
            <label>Price</label>
            <div className="input-wrapper">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label>Duration (minutes)</label>
            <div className="input-wrapper">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className="form-control">
          <label>Service Highlights (separate by new lines)</label>
          <div className="input-wrapper">
            <textarea
              rows="4"
              value={serviceHighlights}
              onChange={(e) => setServiceHighlights(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="form-control">
          <label>Image</label>
          <div className="input-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-green">
          Add Service
        </button>
      </form>
    </div>
  );
};

export default AddService;
