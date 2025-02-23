import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "./ReviewForm";
import ReviewSection from "./ReviewSection";
import ImageGallery from "./ImageGallery";
import ServiceHeader from "./ServiceHeader";
import { UserContext } from "./../../../context/UserContext";
import CartWrapper from "../../../context/CartContext";
import Loading from "../../Loading";

const ServiceDetail = () => {
  const { sid } = useParams();
  const [service, setService] = useState({});
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  console.log(service);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:4000/api/services/s-detail/${sid}`
        );
        setService(data.service);
        setReview(data.service.customerReviews || []);
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
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
  if (loading) {
    return <Loading />;
  }

  return (
    <CartWrapper>
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
        {user?.role !== "Admin" && user?.role !== "Employee" ? (
          <ReviewForm
            serviceId={service._id}
            userId={user?._id}
            onReviewAdded={addNewReview}
          />
        ) : (
          ""
        )}
      </div>
    </CartWrapper>
  );
};

export default ServiceDetail;
