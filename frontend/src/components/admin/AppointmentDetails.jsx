import React, { useEffect, useState, useRef, useContext } from "react";
import { FaFileInvoice } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { UserContext } from "./../../context/UserContext";
import Loading from "./../Loading";
import { convertTo12HourFormat } from "../../App";
const AppointmentDetails = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const { aid } = useParams();
  const { user } = useContext(UserContext);
  const invoiceRef = useRef(null);
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:4000/api/appointment/all-appointments/"
        );
        const foundAppointment = data.allAppointments.find(
          (appointment) => appointment.appointmentId === aid
        );
        setAppointment(foundAppointment);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [aid]);

  if (!appointment) {
    return <Loading />;
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const generateInvoice = () => {
    const invoiceElement = invoiceRef.current;
    if (!invoiceElement) return;

    const options = {
      margin: 10,
      filename: `Invoice_${appointment.appointmentId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(invoiceElement).set(options).save();
  };

  console.log(appointment);
  const hours = Math.floor(appointment.serviceDuration / 60);
  const minutes = appointment.serviceDuration % 60;
  return (
    <div className="appointment-card-details" style={{ position: "relative" }}>
      <h2 className="card-title">Appointment Details</h2>

      {appointment?.discountApplied && appointment?.discountApplied != 0 ? (
        <span
          className="s-badge service-badge"
          style={{ fontSize: "16px", top: "10px" }}
        >
          {appointment.discountApplied}% Off
        </span>
      ) : (
        ""
      )}
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
        <div className="card-section employee-details">
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
        </div>

        {/* Service Details */}
        <div className="card-section service-details">
          <h3>Service</h3>
          <p>
            Service Name: <br />
            <strong>{appointment.serviceName}</strong>
          </p>
          <p>
            Price:{" "}
            <span
              style={{
                textDecoration:
                  appointment?.discountApplied &&
                  appointment.discountApplied != 0
                    ? "line-through"
                    : "none",
                fontWeight: appointment.discountOffer != 0 ? "normal" : "bold",
              }}
            >
              ₹{appointment.priceAtBooking}
            </span>
            {appointment.discountApplied != 0 && (
              <span className="discount"> ₹{appointment.finalPrice}</span>
            )}
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
            Appointment Date: <br />
            <strong>{appointment.date}</strong>
          </p>
          <p>
            Appointment Time: <br />
            <strong>
              {`${convertTo12HourFormat(
                appointment.time.split("-")[0]
              )}-${convertTo12HourFormat(appointment.time.split("-")[1])}`}
            </strong>
          </p>
          <p>
            Applied: <br />
            <strong>{formatDate(appointment.applyDate)}</strong>
          </p>
        </div>
      </div>
      <div style={{ display: "none" }}>
        <div ref={invoiceRef}>
          <div className="address">
            <h1>Beauty & Bliss Parlour</h1>
            <p>
              123 Glamour Street, Suite 456, Beauty Bay, Radiance City, 78901
            </p>
            <p>
              Email: beautybliss.verify@gmail.com | Phone: +1 (123) 456-7890
            </p>
          </div>
          <br />
          <hr />
          <br />
          <div className="invoice-data">
            <p>
              <strong>Invoice ID:</strong> {appointment.appointmentId}
            </p>
            <p>
              <strong>Date:</strong> {new Date().toISOString().split("T")[0]}
            </p>
          </div>
          <table className="invoice-table">
            <tbody>
              <tr>
                <th colSpan={2}>Customer Details</th>
              </tr>
              <tr>
                <td>Name:</td>
                <td>{appointment.customerName}</td>
              </tr>
              <tr>
                <td>Phone:</td>
                <td>{appointment.customerPhone}</td>
              </tr>
              <tr style={{ marginBottom: "20px" }}>
                <td>Email:</td>
                <td>{appointment.customerEmail}</td>
              </tr>

              <tr>
                <th colSpan={2}>Employee Assigned</th>
              </tr>
              <tr>
                <td>Name:</td> <td>{appointment.employeeName}</td>
              </tr>
              <tr>
                <td>Phone:</td> <td>{appointment.employeePhone}</td>
              </tr>
              <tr style={{ marginBottom: "20px" }}>
                <td>Email:</td> <td>{appointment.employeeEmail}</td>
              </tr>

              <tr>
                <th colSpan={2}>Service Details</th>
              </tr>
              <tr>
                <td> Service:</td> <td>{appointment.serviceName}</td>
              </tr>
              <tr>
                <td>Duration:</td>
                <td>
                  {hours > 0 ? `${hours} Hour${hours > 1 ? "s" : ""}` : ""}
                  {minutes > 0
                    ? `${minutes} Minute${minutes > 1 ? "s" : ""}`
                    : ""}
                </td>
              </tr>
              <tr style={{ marginBottom: "20px" }}>
                <td>Price:</td>{" "}
                <td
                  className="d-flex"
                  style={{ gap: "5px", justifyContent: "center" }}
                >
                  <span
                    style={{
                      textDecoration:
                        appointment.discountApplied != 0
                          ? "line-through"
                          : "none",
                    }}
                  >
                    ₹{appointment.priceAtBooking}
                  </span>
                </td>
              </tr>
              {appointment.discountApplied != 0 && (
                <>
                  <tr style={{ marginBottom: "20px" }}>
                    <td>Discount:</td>
                    <td>
                      <span style={{ color: "red" }}>
                        {appointment.discountApplied}% Off
                      </span>
                    </td>
                  </tr>
                  <tr style={{ marginBottom: "20px" }}>
                    <td>Actual Price:</td>
                    <td>
                      <span style={{ color: "#287171" }}>
                        ₹
                        {appointment.priceAtBooking -
                          (appointment.discountApplied / 100) *
                            appointment.priceAtBooking}
                      </span>
                    </td>
                  </tr>
                </>
              )}

              <tr>
                <th colSpan={2}>Timing</th>
              </tr>
              <tr>
                <td>Appointment Date:</td>
                <td>{appointment.date}</td>
              </tr>
              <tr>
                <td>Appointment Time:</td>
                <td>{appointment.time}</td>
              </tr>
              <tr>
                <td> Applied: </td>
                <td>{formatDate(appointment.applyDate)} </td>
              </tr>
            </tbody>
          </table>

          <div className="invoice-footer">
            <p>Thank you for choosing Beauty & Bliss Parlour! 💕</p>
          </div>
        </div>
      </div>
      {user?.role && user.role == "Admin" && (
        <div className="app-detail-btn">
          <button onClick={generateInvoice}>
            <FaFileInvoice /> Generate Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;
