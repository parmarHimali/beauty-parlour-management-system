import React, { useContext, useRef, useState, useEffect } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

const ImageGallery = ({ service, setService }) => {
  const { user } = useContext(UserContext);
  const inputRef = useRef(null);
  const [galleryImages, setGalleryImages] = useState(
    service.employeeImages || []
  );
  useEffect(() => {
    setGalleryImages(service.employeeImages || []);
  }, [service]);

  // Handle file selection
  const handleFileChange = async (event) => {
    if (!event.target.files.length) return;
    const file = event.target.files[0];
    await handleAddToGallery(file);
  };

  // Upload image to backend and update UI
  const handleAddToGallery = async (file) => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("type", "employee");
    formData.append("serviceId", service._id);
    formData.append("image", file);

    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/services/upload-gallery/${service._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Upload successful:", data);
      setService((prev) => ({
        ...prev,
        employeeImages: data.message.uploadedImages,
      }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    }
  };

  // Trigger file input
  const handlePlus = () => {
    inputRef.current.click();
  };

  return (
    <div className="image-gallery">
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {user?.role === "Employee" && (
          <div className="gallery-image add-gallery" onClick={handlePlus}>
            <IoMdAddCircle />
            <input
              type="file"
              accept="image/*"
              hidden
              ref={inputRef}
              onChange={handleFileChange}
            />
            <span>Add Photo</span>
          </div>
        )}
        {galleryImages.length == 0 && (
          <img
            src={`http://localhost:4000/${service.image}`}
            alt={service.name}
            className="gallery-image"
            onClick={() =>
              window.open(`http://localhost:4000/${service.image}`, "_blank")
            }
          />
        )}
        {[...galleryImages].reverse().map((image, index) => (
          <img
            key={index}
            src={`http://localhost:4000/${image}`}
            alt={`Gallery Image ${index + 1}`}
            className="gallery-image"
            onClick={() =>
              window.open(`http://localhost:4000/${image}`, "_blank")
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
