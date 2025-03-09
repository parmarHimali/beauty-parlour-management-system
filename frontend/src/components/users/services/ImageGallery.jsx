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
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    setGalleryImages(service.employeeImages || []);
  }, [service]);

  const handleFileChange = (event) => {
    if (!event.target.files.length) return;
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setIsPopupOpen(true);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      toast.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("type", "employee");
    formData.append("serviceId", service._id);
    formData.append("image", selectedFile);

    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/services/upload-gallery/${service._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setService((prev) => ({
        ...prev,
        employeeImages: data.uploadedImages,
      }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
    } finally {
      setIsPopupOpen(false);
      setSelectedFile(null);
      setPreviewImage(null);
    }
  };

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
        {galleryImages.length === 0 && (
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
          <div key={image._id} className="gallery-emp">
            <img
              src={`http://localhost:4000/${image.imageUrl}`}
              alt={`Gallery Image ${index + 1}`}
              className="gallery-image"
              onClick={() =>
                window.open(`http://localhost:4000/${image.imageUrl}`, "_blank")
              }
            />
            <span className="emp-badge">{image.employeeName}</span>
          </div>
        ))}
      </div>

      {/* Image Preview Popup */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Preview Image</h3>
            <img
              src={previewImage}
              alt="Selected Preview"
              className="preview-image"
            />
            <button className="upload-btn" onClick={handleUploadImage}>
              Upload Image
            </button>
            <button
              className="cancel-btn"
              onClick={() => setIsPopupOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
