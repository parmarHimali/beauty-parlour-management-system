import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
  MdSearch,
} from "react-icons/md";
import { Link } from "react-router-dom";
import Loading from "../Loading";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [filteredServices, setFilteredServices] = useState([]); // State to store filtered services
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/services/all-service"
        );
        setServices(data.services);
        setFilteredServices(data.services.reverse());
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
    setSearchQuery(query);
    setFilteredServices(
      services.filter((service) => service.name.toLowerCase().includes(query))
    );
  };

  const handleDelete = async (sid) => {
    const isDlt = confirm(
      "Are you sure you want to delete this Service, related reviews and employee speciality?"
    );
    if (isDlt) {
      try {
        setLoading(true);
        const { data } = await axios.delete(
          `http://localhost:4000/api/services/dlt-service/${sid}`
        );
        toast.success(data.message);
        // Refresh services list after deletion
        const updatedServices = services.filter(
          (service) => service._id !== sid
        );
        setServices(updatedServices);
        setFilteredServices(updatedServices);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to delete service"
        );
      } finally {
        setLoading(false);
      }
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="service-list-container">
      <div className="heading heading-container">
        <h2>Services List</h2>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Search service"
            value={searchQuery}
            onChange={handleSearch}
          />
          <MdSearch />
        </div>
      </div>
      <div className="service-cards-container">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => {
            const hours = Math.floor(service.duration / 60);
            const minutes = service.duration % 60;
            const customerRatings = service.customerRatings || 0;
            const fullStars = Math.floor(customerRatings); // Number of full stars
            //customerRatings % 1 gives the fractional part of customerRatings.
            // If the fractional part is greater than or equal to 0.5, then hasHalfStar will be true
            const hasHalfStar = customerRatings % 1 >= 0.5; // Check if a half star is needed
            //5 - fullStars:Subtracts the number of full stars from the total 5 stars
            //(hasHalfStar ? 1 : 0): If a half star is needed (hasHalfStar is true), it subtracts 1 else 0
            const emptyStars = Math.max(
              0,
              5 - fullStars - (hasHalfStar ? 1 : 0)
            );

            return (
              <div className="service-card" key={service._id}>
                <div className="service-card-image">
                  <img
                    src={
                      `http://localhost:4000/${service.image}` ||
                      "/default-image.jpg"
                    }
                    alt={service.name}
                  />
                </div>
                <div className="service-card-content">
                  <div className="card-details">
                    <h3>{service.name}</h3>
                    <p>
                      <b>Price: </b>
                      {`₹${service.price}`}
                    </p>
                    <p>
                      <b>Duration: </b>
                      {hours > 0 ? `${hours} Hour${hours > 1 ? "s" : ""}` : ""}
                      {minutes > 0
                        ? ` ${minutes} Minute${minutes > 1 ? "s" : ""}`
                        : ""}
                    </p>
                  </div>
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
                          <MdOutlineStarBorder
                            key={`empty-${index}`}
                            color="grey"
                          />
                        ))}
                    </div>
                  </div>
                  <div className="card-actions">
                    <Link
                      to={`/admin/see-more/${service._id}`}
                      className="action-link"
                    >
                      See More
                    </Link>
                    <Link
                      to={`/admin/service-edit/${service._id}`}
                      className="action-link"
                    >
                      Edit
                    </Link>
                    <a
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleDelete(service._id)}
                    >
                      Delete
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h1 className="not-found">No Service found</h1>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
