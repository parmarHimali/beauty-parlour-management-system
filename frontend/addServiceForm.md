import React, { useState } from 'react';
import axios from 'axios';

const AddService = () => {
const [formData, setFormData] = useState({
categoryId: '',
name: '',
description: '',
price: '',
duration: '',
serviceHighlights: '', // Textarea for highlights (single string)
image: null,
});

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData({
...formData,
[name]: value,
});
};

const handleImageChange = (e) => {
setFormData({
...formData,
image: e.target.files[0],
});
};

const handleSubmit = async (e) => {
e.preventDefault();

    // Split the serviceHighlights by new lines to create an array
    const highlights = formData.serviceHighlights.split('\n').map((highlight) => ({
      time: '', // Placeholder for time
      highlight: highlight.trim(), // Remove any extra spaces around the highlight
    }));

    const data = new FormData();
    data.append("categoryId", formData.categoryId);
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("duration", formData.duration);
    data.append("serviceHighlights", JSON.stringify(highlights)); // Send as array
    data.append("image", formData.image);

    try {
      const response = await axios.post('/api/services/add', data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the service");
    }

};

return (
<div>
<h1>Add New Service</h1>
<form onSubmit={handleSubmit} encType="multipart/form-data">
<input
          type="text"
          name="categoryId"
          placeholder="Category ID"
          value={formData.categoryId}
          onChange={handleInputChange}
          required
        />
<input
          type="text"
          name="name"
          placeholder="Service Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
<textarea
          name="description"
          placeholder="Service Description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
<input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
<input
          type="number"
          name="duration"
          placeholder="Duration (in minutes)"
          value={formData.duration}
          onChange={handleInputChange}
          required
        />

        {/* Textarea for Service Highlights */}
        <h3>Service Highlights</h3>
        <textarea
          name="serviceHighlights"
          placeholder="Enter highlights, each on a new line"
          value={formData.serviceHighlights}
          onChange={handleInputChange}
          rows={5}
        />

        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          required
        />

        <button type="submit">Add Service</button>
      </form>
    </div>

);
};

export default AddService;
