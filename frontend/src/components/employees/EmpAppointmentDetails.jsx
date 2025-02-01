import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaFileInvoice } from "react-icons/fa";
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

  // Helper function to format time
  const formatTime = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  // Helper function to calculate end time
  const calculateEndTime = (startTime, duration) => {
    let [startHours, startMinutes] = startTime.split(":").map(Number);
    let durationHours = Math.floor(duration / 60);
    let durationMinutes = duration % 60;

    let endHours = startHours + durationHours;
    let endMinutes = startMinutes + durationMinutes;

    if (endMinutes >= 60) {
      endHours += Math.floor(endMinutes / 60);
      endMinutes %= 60;
    }

    let ampm = endHours >= 12 ? "PM" : "AM";
    endHours = endHours % 12 || 12;

    return `${endHours}:${endMinutes.toString().padStart(2, "0")} ${ampm}`;
  };

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

        {/* Employee Details */}
        {/* <div className="card-section employee-details">
          <h3>Employee</h3>
          <p>
            Employee Name: <br />
            <strong>{appointment.employeeName}</strong>
          </p>
          <p>
            Phone: <strong>{appointment.employeePhone}</strong>
          </p>
          <p>
            Email: <br /> <strong>{appointment.employeeEmail}</strong>
          </p>
        </div> */}

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
            Appointment Time:{" "}
            <strong>
              {formatTime(appointment.time)} -{" "}
              {calculateEndTime(appointment.time, appointment.serviceDuration)}
            </strong>
          </p>
          <p>
            Applied: <strong>{formatDate(appointment.applyDate)}</strong>
          </p>
        </div>
      </div>
      <div className="app-detail-btn">
        <button>
          <FaFileInvoice /> Generate Invoice
        </button>
      </div>
    </div>
  );
};

export default EmpAppointmentDetails;
