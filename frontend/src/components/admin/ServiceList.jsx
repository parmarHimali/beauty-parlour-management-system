import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State to store search query
  const [filteredServices, setFilteredServices] = useState([]); // State to store filtered services

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/services/all-service"
        );
        setServices(data.services);
        setFilteredServices(data.services.reverse());
      } catch (error) {
        console.log(error);
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
      }
    }
  };

  return (
    <div className="table-list">
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
      <table>
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Duration</th>
            <th style={{ width: "102px" }}>More Detail</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              const hours = Math.floor(service.duration / 60);
              const minutes = service.duration % 60;
              return (
                <tr key={service._id}>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>&#8377;{service.price}</td>
                  <td>
                    {hours > 0 ? `${hours} Hour${hours > 1 ? "s" : ""}` : ""}{" "}
                    {minutes > 0
                      ? `${minutes} Minute${minutes > 1 ? "s" : ""}`
                      : ""}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Link to={`/admin/see-more/${service._id}`}>see more</Link>
                  </td>
                  <td>
                    <Link to={`/admin/service-edit/${service._id}`}>Edit</Link>
                    <a
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => handleDelete(service._id)}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7">No Service found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;
