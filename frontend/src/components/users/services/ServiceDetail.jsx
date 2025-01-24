import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import ReviewSection from "./ReviewSection";
import ImageGallery from "./ImageGallery";
import ServiceHeader from "./ServiceHeader";
import { UserContext } from "./../../../context/UserContext";

const ServiceDetail = () => {
  const { sid } = useParams();
  const [service, setService] = useState({});
  const [review, setReview] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/services/s-detail/${sid}`
        );
        setService(data.service);
        setReview(data.service.customerReviews || []);
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    };

    fetchService();
  }, [sid]);

  // Function to add a new review to the state
  const addNewReview = (newReview) => {
    setReview((prevReviews) => {
      const updatedReviews = [newReview, ...prevReviews]; // New review comes at the start
      const totalRatings = updatedReviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRatings / updatedReviews.length;

      setService((prevService) => ({
        ...prevService,
        customerRatings: averageRating,
      }));

      return updatedReviews; // Reviews will now show in the correct order
    });
  };

  return (
    <div className="service-detail">
      {/* Service Header */}
      <ServiceHeader service={service} />

      {/* Image Gallery */}
      <ImageGallery service={service} />

      {/* Highlights Section */}
      <div className="service-highlights">
        <h2>Highlights</h2>
        <ul>
          {service.serviceHighlights &&
            service.serviceHighlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
        </ul>
      </div>

      {/* Reviews Section */}
      <ReviewSection reviews={review} />

      {/* Review Form */}
      {user?.role !== "Admin" && (
        <ReviewForm
          serviceId={service._id}
          userId={user?._id}
          onReviewAdded={addNewReview}
        />
      )}
    </div>
  );
};

export default ServiceDetail;
