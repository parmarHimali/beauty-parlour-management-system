import React, { useContext } from "react";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
} from "react-icons/md";
import { UserContext } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ServiceHeader = ({ service }) => {
  const navigateTo = useNavigate();
  const { setShowLogin, isAuthorized } = useContext(UserContext);
  const handleBookAppointment = () => {
    if (isAuthorized) {
      navigateTo("/book-appointment");
    } else {
      toast.error("please login to book appointment!");
      setShowLogin(true);
    }
  };
  const customerRatings = service.customerRatings || 0;
  const fullStars = Math.floor(customerRatings); // Number of full stars
  //customerRatings % 1 gives the fractional part of customerRatings.
  // If the fractional part is greater than or equal to 0.5, then hasHalfStar will be true
  const hasHalfStar = customerRatings % 1 >= 0.5; // Check if a half star is needed
  //5 - fullStars:Subtracts the number of full stars from the total 5 stars
  //(hasHalfStar ? 1 : 0): If a half star is needed (hasHalfStar is true), it subtracts 1 else 0
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));
  const hours = Math.floor(service.duration / 60);
  const minutes = service.duration % 60;
  return (
    <div className="service-header">
      <h1>{service.name}</h1>
      <p>{service.description}</p>
      <p>
        <b>Price:</b> &#8377;{service.price}
      </p>
      <p>
        <b>Duration:</b>{" "}
        {hours > 0 ? `${hours} Hour${hours > 1 ? "s" : ""}` : ""}{" "}
        {minutes > 0 ? `${minutes} Minute${minutes > 1 ? "s" : ""}` : ""}
      </p>
      <div className="avg-rating">
        <b>Ratings:</b>
        <div>
          {Array(fullStars)
            .fill()
            .map((_, index) => (
              <MdOutlineStar key={`full-${index}`} color="gold" />
            ))}
          {/* Half star */}
          {hasHalfStar && <MdOutlineStarHalf color="gold" />}
          {/* Empty stars */}
          {Array(emptyStars)
            .fill()
            .map((_, index) => (
              <MdOutlineStarBorder key={`empty-${index}`} color="grey" />
            ))}
        </div>
      </div>
      <button className="btns btn-book" onClick={handleBookAppointment}>
        Book Now
      </button>
    </div>
  );
};

export default ServiceHeader;
