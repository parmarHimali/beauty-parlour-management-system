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
  const [status, setStatus] = useState("");
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
  console.log(status);
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

  return (
    <div className="table-list">
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
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Customer Phone</th>
            <th>Service Name</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => {
              const hours = Math.floor(appointment.serviceId.duration / 60);
              const minutes = appointment.serviceId.duration % 60;
              return (
                <tr key={appointment._id}>
                  <td width={"90px"}>{appointment.userId.name}</td>
                  <td>{appointment.userId.email}</td>
                  <td>{appointment.userId.phone}</td>
                  <td>{appointment.serviceId.name}</td>
                  {/* <td>{appointment.serviceName}</td> */}
                  <td>&#8377; {appointment.serviceId.price}</td>
                  <td>
                    {hours > 0 ? `${hours} Hour${hours > 1 ? "s" : ""}` : ""}{" "}
                    {minutes > 0
                      ? `${minutes} Minute${minutes > 1 ? "s" : ""}`
                      : ""}
                  </td>
                  <td width={"110px"}>{appointment.date}</td>
                  <td>{appointment.time}</td>

                  <td>
                    <select
                      className={`status ${appointment.status.toLowerCase()}`}
                      value={appointment.status}
                      onChange={(e) => handleStatusChange(e, appointment._id)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="10">No Appointments found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmpDashboard;
