import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
} from "react-icons/md";
import { UserContext } from "../../../context/userContext";
import { toast } from "react-hot-toast";
import Loading from "../../Loading";

const Services = () => {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState({});
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { cid } = useParams();
  const navigateTo = useNavigate();
  const { isAuthorized, setShowLogin } = useContext(UserContext);

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/category/${cid}`
        );
        setCategory(data.category[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryDetail();
    const fetchService = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:4000/api/services/${cid}`
        );
        setServices(data.services);
        setFilteredServices(data.services);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
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
  console.log(category);

  const handleBookAppointment = () => {
    if (isAuthorized) {
      navigateTo("/book-appointment");
    } else {
      toast.error("please login to book appointment!");
      setShowLogin(true);
    }
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
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="service-title">
        <h2>{category.name} Services</h2>
        <p>{category.description}</p>

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
            <div
              className="sub-service"
              key={service._id}
              style={{ cursor: "pointer" }}
              onClick={() => navigateTo(`/s-detail/${service._id}`)}
            >
              {service?.discountOffer && service?.discountOffer != 0 ? (
                <span className="s-badge service-badge">
                  {service.discountOffer}% Off
                </span>
              ) : (
                ""
              )}

              <div className="service-image">
                <img
                  src={`http://localhost:4000/${service.image}`}
                  alt={service.name}
                />
              </div>
              <div className="content">
                <h3>{service.name}</h3>
                <div className="service-price">
                  <b>Price:</b>{" "}
                  <span
                    style={{
                      textDecoration:
                        service?.discountOffer && service?.discountOffer != 0
                          ? "line-through"
                          : "none",
                      color:
                        service?.discountOffer && service?.discountOffer != 0
                          ? "#4f4f4f"
                          : "black",
                    }}
                  >
                    &#8377;{service.price} {"  "}
                  </span>
                  {service?.discountOffer ? (
                    <span className="discount">
                      &#8377;
                      {service.price -
                        service.price * (service.discountOffer / 100)}
                    </span>
                  ) : (
                    ""
                  )}
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

export default Services;
