import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EmpAppointmentDetails = () => {
  const [appointment, setAppointment] = useState(null);
  const { aid } = useParams();

  useEffect(() => {
    const fetchAppointment = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/appointment/all-appointments/"
      );
      const foundAppointment = data.allAppointments.find(
        (appointment) => appointment.appointmentId === aid
      );
      setAppointment(foundAppointment);
    };

    fetchAppointment();
  }, [aid]);

  if (!appointment) {
    return <h2 className="loading-text">Loading appointment details...</h2>;
  }

  // Format Apply Date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };
  console.log(appointment);
  const hours = Math.floor(appointment.serviceDuration / 60);
  const minutes = appointment.serviceDuration % 60;

  return (
    <div className="appointment-card-details">
      <h2 className="card-title">Appointment Details</h2>

      <div className="appointment-container">
        {/* User Details */}
        <div className="card-section user-details">
          <h3>User</h3>
          <p>
            Customer Name: <br />
            <strong>{appointment.customerName}</strong>
          </p>
          <p>
            Phone: <strong>{appointment.customerPhone}</strong>
          </p>
          <p>
            Email: <br />
            <strong>{appointment.customerEmail}</strong>
          </p>
        </div>

        {/* Service Details */}
        <div className="card-section service-details">
          <h3>Service</h3>
          <p>
            Service Name: <br />
            <strong>{appointment.serviceName}</strong>
          </p>
          <p>
            Price: <strong>₹{appointment.servicePrice}</strong>
          </p>
          <p>
            Duration:{" "}
            <strong>
              {" "}
              {hours > 0 ? `${hours} Hour${hours > 1 ? "s" : ""}` : ""}{" "}
              {minutes > 0 ? `${minutes} Minute${minutes > 1 ? "s" : ""}` : ""}
            </strong>
          </p>
          <p className={`status ${appointment.status.toLowerCase()}`}>
            status: <strong>{appointment.status}</strong>
          </p>
        </div>

        {/* Timing Details */}
        <div className="card-section timing-details">
          <h3>Timing</h3>
          <p>
            Appointment Date: <strong>{appointment.date}</strong>
          </p>
          <p>
            Appointment Time: <strong>{appointment.time}</strong>
          </p>
          <p>
            Applied: <strong>{formatDate(appointment.applyDate)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmpAppointmentDetails;
