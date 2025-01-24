import React from "react";
import { useNavigate } from "react-router-dom";
const ImageGallery = ({ service }) => {
  const navigateTo = (url) => {
    window.open(url, "_blank");
  };
  return (
    <div className="image-gallery">
      <h2>Gallery</h2>
      {/* {service.employeeImages && service.employeeImages.length > 0 ? ( */}
      <div className="gallery-grid">
        <img
          src={`http://localhost:4000/${service.image}`}
          alt={service.name}
          className="gallery-image"
          onClick={() => navigateTo(`http://localhost:4000/${service.image}`)}
        />
        {service.employeeImages &&
          service.employeeImages.length > 0 &&
          service.employeeImages.map((image, index) => (
            <img
              key={index}
              src={`http://localhost:4000/${image}`}
              alt={`Gallery Image ${index + 1}`}
              className="gallery-image"
              onClick={() => navigateTo(`http://localhost:4000/${image}`)}
            />
          ))}
      </div>
      {/* ) : (
        <p>No gallery images available.</p>
      )} */}
    </div>
  );
};

export default ImageGallery;
