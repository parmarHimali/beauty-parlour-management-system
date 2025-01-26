import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
} from "react-icons/md";
import { toast } from "react-hot-toast";
import { UserContext } from "../../context/userContext";

const EmpServices = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [search, setSearch] = useState("");
  const navigateTo = useNavigate();
  const { isAuthorized, setShowLogin, user } = useContext(UserContext);

  console.log(user);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/employee/speciality/${user._id}`
        );
        console.log(data);

        setServices(data.services);
        setFilteredServices(data.services);
      } catch (error) {
        console.log(error);
      }
    };
    fetchService();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredServices(
      services.filter((service) => {
        return service.name.toLowerCase().includes(query);
      })
    );
  };

  const rating = (rating) => {
    const customerRatings = rating || 0;
    const fullStars = Math.floor(customerRatings); // Number of full stars
    const hasHalfStar = customerRatings % 1 >= 0.5; // Check if a half star is needed
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));
    return (
      <div className="avg-rating">
        <div>
          {Array(fullStars)
            .fill()
            .map((_, index) => (
              <MdOutlineStar key={`full-${index}`} color="gold" />
            ))}
          {hasHalfStar && <MdOutlineStarHalf color="gold" />}
          {Array(emptyStars)
            .fill()
            .map((_, index) => (
              <MdOutlineStarBorder key={`empty-${index}`} color="grey" />
            ))}
        </div>
      </div>
    );
  };
  return (
    <>
      <div className="service-title">
        {services.length > 0 && (
          <input
            type="text"
            placeholder="Search Any Service"
            className="search"
            value={search}
            onChange={handleSearch}
          />
        )}
      </div>
      <div className="all-services">
        {filteredServices.map((service) => {
          const hours = Math.floor(service.duration / 60);
          const minutes = service.duration % 60;
          return (
            <div className="sub-service" key={service._id}>
              <div className="service-image">
                <img
                  src={`http://localhost:4000/${service.image}`}
                  alt={service.name}
                />
              </div>
              <div className="content">
                <h2>{service.name}</h2>
                <div>
                  <b>Price:</b> &#8377;{service.price}
                </div>
                <div style={{ textAlign: "left" }}>
                  {/* <b>Duration:</b> {service.duration / 60} Hour */}
                  <b>Duration: </b>
                  {hours > 0 ? `${hours} Hour${hours > 1 ? "s" : ""}` : ""}{" "}
                  {minutes > 0
                    ? `${minutes} Minute${minutes > 1 ? "s" : ""}`
                    : ""}
                </div>
                <div style={{ textAlign: "left" }}>
                  <b>rates:</b> {rating(service.customerRatings || 0)}
                </div>
                <Link to={`/s-detail/${service._id}`} style={{ color: "grey" }}>
                  See more details
                </Link>
                {/* <button
                  className="btns btn-book"
                  onClick={handleBookAppointment}
                >
                  Book Now
                </button> */}
              </div>
            </div>
          );
        })}
        {services.length === 0 && (
          <div className="no-service">
            <h1 className="no-msg">No Services are available now!</h1>
            <p>We will provide it soon...</p>
            <br />
            <Link to={"/categories"} className="btns btn-back">
              Back to Categories
            </Link>
          </div>
        )}
        {services.length > 0 && filteredServices.length === 0 && (
          <h1 className="no-msg">"{search}" is not available!</h1>
        )}
      </div>
    </>
  );
};

export default EmpServices;
