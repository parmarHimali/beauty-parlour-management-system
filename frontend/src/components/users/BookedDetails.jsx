import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext"; // Make sure you have this context
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

const BookedDetails = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/appointment/all-appointments/"
      );
      const myApp = data.allAppointments.filter(
        (appointment) => appointment?.userId?._id === user?._id
      );
      setAppointments(myApp);
      setFilteredAppointments(myApp);
    };
    fetchAppointments();
  }, [user]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const updated = appointments.filter((appointment) =>
      appointment.serviceName.toLowerCase().includes(query)
    );
    setFilteredAppointments(updated);
  };

  console.log(appointments);

  return (
    <div className="appointments-list">
      <div className="heading heading-container">
        <h2>You booked Appointments</h2>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Search appointment by service"
            value={searchQuery}
            onChange={handleSearch}
          />
          <MdSearch style={{ top: "6px" }} />
        </div>
      </div>

      <div className="appointments-cards">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.reverse().map((appointment) => {
            const hours = Math.floor(appointment.serviceDuration / 60);
            const minutes = appointment.serviceDuration % 60;
            return (
              <div key={appointment.appointmentId} className="appointment-card">
                <div className="card-body">
                  <div className="card-item card-header">
                    <strong>{appointment.serviceName}</strong>
                    <span
                      className={`status ${appointment.status.toLowerCase()}`}
                    >
                      {appointment.status || "Pending"}
                    </span>
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
                  <Link
                    className="btn-edit"
                    to={`/appointment/${appointment.appointmentId}`}
                  >
                    See More
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

export default BookedDetails;
