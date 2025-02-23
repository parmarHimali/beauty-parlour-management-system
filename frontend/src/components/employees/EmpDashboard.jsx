import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "../../employee.css";
import { toast } from "react-hot-toast";
const EmpDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(
        `http://localhost:4000/api/appointment/emp-app/${user._id}`
      );

      setAppointments(data.appointments);
      setFilteredAppointments(data.appointments.reverse());
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    console.log(query);

    setSearchQuery(query);
    setFilteredAppointments(
      appointments.filter((appointment) =>
        appointment.userId.name.toLowerCase().includes(query)
      )
    );
  };
  const handleStatusChange = async (e, appointmentId) => {
    const newStatus = e.target.value;

    // Update the status in the frontend state
    setFilteredAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment._id === appointmentId
          ? { ...appointment, status: newStatus }
          : appointment
      )
    );

    try {
      // Send the status update to the backend
      const { data } = await axios.put(
        `http://localhost:4000/api/appointment/update-status/${appointmentId}`,
        {
          status: newStatus,
        }
      );
      toast.success(data.message);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
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
            const hours = Math.floor(appointment.serviceId.duration / 60);
            const minutes = appointment.serviceId.duration % 60;
            return (
              <div key={appointment._id} className="appointment-card">
                <div className="card-header">
                  <h3 style={{ textDecoration: "underline" }}>
                    {appointment?.userId?.name}
                  </h3>
                  <select
                    className={`status ${appointment.status.toLowerCase()}`}
                    value={appointment.status}
                    style={{ width: "max-content" }}
                    onChange={(e) => handleStatusChange(e, appointment._id)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="card-body">
                  <div className="card-item">
                    <strong>{appointment.serviceId.name}</strong>
                  </div>
                  <hr style={{ margin: "7px 0 5px 0" }} />
                  <div className="card-item">
                    <strong>Price:</strong> &#8377;{" "}
                    {appointment.serviceId.price}
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
                    <strong>Time:</strong> {formatTime(appointment.time)} -{" "}
                    {calculateEndTime(
                      appointment.time,
                      appointment.serviceId.duration
                    )}
                  </div>
                </div>

                <div className="card-actions" style={{ marginTop: "10px" }}>
                  <Link
                    className="btn-edit"
                    to={`/emp/appointment/${appointment._id}`}
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

export default EmpDashboard;
