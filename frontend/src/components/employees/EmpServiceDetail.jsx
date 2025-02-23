import React, { useEffect, useState } from "react";
import ServiceHeader from "../users/services/ServiceHeader";
import axios from "axios";
import { useParams } from "react-router-dom";
import ImageGallery from "../users/services/ImageGallery";
import ReviewSection from "../users/services/ReviewSection";

const EmpServiceDetail = () => {
  const [service, setService] = useState({});
  const [review, setReview] = useState([]);
  const { sid } = useParams();
  console.log(sid);

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
  return (
    <>
      <div className="service-detail">
        <ServiceHeader service={service} />
        <ImageGallery service={service} setService={setService} />
        <div className="service-highlights">
          <h2>Highlights</h2>
          <ul>
            {service.serviceHighlights &&
              service.serviceHighlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
          </ul>
        </div>
        <ReviewSection reviews={review} />
      </div>
    </>
  );
};

export default EmpServiceDetail;
