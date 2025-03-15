import React, { useContext } from "react";
import { FaShareFromSquare } from "react-icons/fa6";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
} from "react-icons/md";
import { UserContext } from "../../../context/UserContext";
import toast from "react-hot-toast";
import { CartContext } from "../../../context/CartContext";
import { IoAddCircle } from "react-icons/io5";
import BookForm from "../BookForm";

const ServiceHeader = ({ service }) => {
  const { setShowLogin, isAuthorized, user } = useContext(UserContext);
  const { cart, setCart, showCart, setShowCart } = useContext(CartContext);
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.name,
        text: `${service.name} - ${service.description}\n\nCheck it out here: ${window.location.href}`,
        url: window.location.href,
      });
    } else {
      // Fallback for devices that don't support Web Share API
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${service.name} - ${service.description}\n\nCheck it out here: ${window.location.href}`
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleBookAppointment = () => {
    if (isAuthorized) {
      // navigateTo("/book-appointment");
      // setCart([...cart, service._id]);
      setShowCart(true);
      // navigateTo(`/cart/${service._id}`);
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
      <div className="share">
        <h2>{service.name}</h2>{" "}
        {service?.discountOffer && service?.discountOffer != 0 ? (
          <span className="s-badge" style={{ fontSize: "16px" }}>
            {service.discountOffer}% Off
          </span>
        ) : (
          ""
        )}
        <FaShareFromSquare onClick={handleShare} />
      </div>
      <p>{service.description}</p>
      <p>
        <b>Price:</b>{" "}
        <span
          style={{
            textDecoration:
              service?.discountOffer && service.discountOffer != 0
                ? "line-through"
                : "none",
          }}
        >
          &#8377;{service.price}
        </span>{" "}
        {service?.discountOffer ? (
          <span className="discount">
            &#8377;
            {service.price - service.price * (service.discountOffer / 100)}
          </span>
        ) : (
          ""
        )}
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
      {user?.role == "User" && (
        <button className="btns btn-book" onClick={handleBookAppointment}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* <span>Add to cart</span> <FaCartPlus /> */}
            <span>Book Appointment</span> <IoAddCircle />
          </div>
        </button>
      )}
      {showCart && (
        <BookForm
          showCart={showCart}
          setShowCart={setShowCart}
          setCart={setCart}
          cart={cart}
        />
      )}
    </div>
  );
};

export default ServiceHeader;
