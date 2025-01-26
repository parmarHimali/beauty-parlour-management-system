import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/appointment/all-appointments/"
      );
      setAppointments(data.allAppointments);
      setFilteredAppointments(data.allAppointments.reverse());
    };
    fetchAppointments();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredAppointments(
      appointments.filter((appointment) =>
        appointment.customerName.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="appointments-list">
      <div className="heading heading-container">
        <h2>All Appointment List</h2>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Search appointment"
            value={searchQuery}
            onChange={handleSearch}
          />
          <MdSearch />
        </div>
      </div>

      <div className="appointments-cards">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => {
            const hours = Math.floor(appointment.serviceDuration / 60);
            const minutes = appointment.serviceDuration % 60;
            return (
              <div key={appointment.appointmentId} className="appointment-card">
                <div className="card-header">
                  <h3 style={{ textDecoration: "underline" }}>
                    {appointment.customerName}
                  </h3>
                  <span
                    className={`status ${appointment.status.toLowerCase()}`}
                  >
                    {appointment.status || "Pending"}
                  </span>
                </div>

                <div className="card-body">
                  <div className="card-item">
                    <strong>{appointment.serviceName}</strong>
                  </div>
                  <hr style={{ margin: "7px 0 5px 0" }} />
                  <div className="card-item">
                    <strong>Price:</strong> &#8377; {appointment.servicePrice}
                  </div>
                  <div className="card-item">
                    <strong>Duration:</strong>{" "}
                    {hours > 0 ? `${hours} Hour${hours > 1 ? "s" : ""}` : ""}{" "}
                    {minutes > 0
                      ? `${minutes} Minute${minutes > 1 ? "s" : ""}`
                      : ""}
                  </div>
                  <div className="card-item">
                    <strong>Date:</strong> {appointment.date}
                  </div>
                  <div className="card-item">
                    <strong>Time:</strong> {appointment.time}
                  </div>
                </div>

                <div className="card-actions" style={{ marginTop: "10px" }}>
                  <Link className="btn-edit">See More</Link>
                  <Link
                    to={`/admin/appointment-edit/${appointment._id}`}
                    className="btn-edit"
                  >
                    Edit
                  </Link>
                  <Link
                    to="#"
                    className="btn-delete"
                    style={{ color: "red" }}
                    onClick={() => handleDelete(appointment._id)}
                  >
                    Delete
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <h1 className="not-found">No Appointments found</h1>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
