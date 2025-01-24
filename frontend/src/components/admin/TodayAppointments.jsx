import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/appointment/today-appointments"
      );
      setAppointments(data.allAppointments);
      setFilteredAppointments(data.allAppointments.reverse());
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    console.log(query);

    setSearchQuery(query);
    setFilteredAppointments(
      appointments.filter((appointment) =>
        appointment.customerName.toLowerCase().includes(query)
      )
    );
  };
  return (
    <div className="table-list">
      <div className="heading heading-container">
        <h2>Today's Appointment List</h2>
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
            <th>Employee Name</th>
            <th>Service Name</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Time</th>
            <th>status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => {
              const hours = Math.floor(appointment.serviceDuration / 60);
              const minutes = appointment.serviceDuration % 60;
              return (
                <tr key={appointment.appointmentId}>
                  <td width={"90px"}>{appointment.customerName}</td>
                  <td>{appointment.customerEmail}</td>
                  <td>{appointment.customerPhone}</td>
                  <td>{appointment.employeeName}</td>
                  <td>{appointment.serviceName}</td>
                  <td style={{ width: "80px" }}>
                    &#8377; {appointment.servicePrice}
                  </td>
                  <td>
                    {hours > 0 ? `${hours} Hour${hours > 1 ? "s" : ""}` : ""}{" "}
                    {minutes > 0
                      ? `${minutes} Minute${minutes > 1 ? "s" : ""}`
                      : ""}
                  </td>
                  <td width={"110px"}>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <span
                      className={`status ${appointment.status?.toLowerCase()}`}
                    >
                      {appointment.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/appointment-edit/${appointment._id}`}>
                      Edit
                    </Link>
                    <Link to="" style={{ color: "red" }}>
                      Delete
                    </Link>
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

export default TodayAppointments;
