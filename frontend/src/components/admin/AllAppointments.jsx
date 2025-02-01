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
  console.log(appointments);
  const formatTime = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const calculateEndTime = (startTime, duration) => {
    let [startHours, startMinutes] = startTime.split(":").map(Number);

    // Convert duration to hours and minutes
    let durationHours = Math.floor(duration / 60);
    let durationMinutes = duration % 60;

    // Calculate end time
    let endHours = startHours + durationHours;
    let endMinutes = startMinutes + durationMinutes;

    if (endMinutes >= 60) {
      endHours += Math.floor(endMinutes / 60);
      endMinutes %= 60;
    }

    let ampm = endHours >= 12 ? "PM" : "AM";
    endHours = endHours % 12 || 12; // Convert 0 to 12

    return `${endHours}:${endMinutes.toString().padStart(2, "0")} ${ampm}`;
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
                  {/* <div className="card-item">
                    <strong>Time:</strong> {appointment.time}
                  </div> */}
                  <div className="card-item">
                    <strong>Time:</strong> {formatTime(appointment.time)} -{" "}
                    {calculateEndTime(
                      appointment.time,
                      appointment.serviceDuration
                    )}
                  </div>
                </div>

                <div className="card-actions" style={{ marginTop: "10px" }}>
                  <Link
                    className="btn-edit"
                    to={`/admin/appointment/${appointment.appointmentId}`}
                  >
                    See More
                  </Link>
                  <Link
                    to={`/admin/appointment-edit/${appointment.appointmentId}`}
                    className="btn-edit"
                  >
                    Edit
                  </Link>
                  <Link
                    to="#"
                    className="btn-delete"
                    style={{ color: "red" }}
                    onClick={() => handleDelete(appointment.appointmentId)}
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
