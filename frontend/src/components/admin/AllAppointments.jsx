"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { MdSearch } from "react-icons/md";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/appointment/all-appointments/"
        );
        setAppointments(data.allAppointments);
        setFilteredAppointments(data.allAppointments.reverse());
      } catch (error) {
        toast.error("Failed to fetch appointments");
      }
    };
    fetchAppointments();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredAppointments(appointments); // Reset when search is cleared
      return;
    }

    const updated = appointments.filter(
      (appointment) =>
        appointment.customerName?.toLowerCase().includes(query) ||
        appointment.serviceName?.toLowerCase().includes(query) ||
        appointment.employeeName?.toLowerCase().includes(query)
    );

    console.log("Filtered Appointments:", updated); // Debugging
    setFilteredAppointments(updated);
  };

  const formatTime = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

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

  const columns = [
    {
      name: "Customer",
      selector: (row) => row.customerName || "N/A",
      sortable: true,
    },
    {
      name: "Service",
      selector: (row) => row.serviceName,
      sortable: true,
      wrap: true,
    },
    {
      name: "Employee",
      selector: (row) => row.employeeName,
      sortable: true,
    },
    {
      name: "Price (₹)",
      selector: (row) => `₹ ${row.servicePrice}`,
      sortable: true,
    },
    {
      name: "Duration",
      selector: (row) =>
        `${Math.floor(row.serviceDuration / 60)}h ${
          row.serviceDuration % 60 == 0 ? "" : `${row.serviceDuration % 60} m`
        }`,
      sortable: true,
      maxWidth: "20px",
      wrap: true,
    },
    { name: "Date", selector: (row) => row.date, sortable: true },
    {
      name: "Time",
      selector: (row) =>
        `${formatTime(row.time)} - ${calculateEndTime(
          row.time,
          row.serviceDuration
        )}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span className={`status ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <Link
          style={{ color: "var(--dark-green)" }}
          to={`/admin/appointment/${row.appointmentId}`}
        >
          View Details
        </Link>
      ),
    },
  ];

  return (
    <div className="appointments-list">
      <div className="heading heading-container" style={{ margin: "5px auto" }}>
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
      <DataTable
        columns={columns}
        data={filteredAppointments}
        pagination
        highlightOnHover
        responsive
        customStyles={customStyles}
        paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
        noDataComponent={
          <div
            style={{
              padding: "10px",
              fontSize: "16px",
              color: "var(--dark-green)",
            }}
          >
            No Appointments found
          </div>
        }
      />
    </div>
  );
};

const customStyles = {
  table: {
    style: {
      width: "100%",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      overflowX: "auto",
    },
  },
  headRow: {
    style: {
      backgroundColor: "var(--dark-green)",
      fontSize: "14px",
      color: "#ffffff",
      textAlign: "center",
      fontWeight: "bold",
    },
  },
  rows: {
    style: {
      textAlign: "center",
      fontSize: "14px",
      fontWeight: "500",
    },
  },
  headCells: {
    style: {
      justifyContent: "center",
      textAlign: "center",
      whiteSpace: "normal",
      wordWrap: "break-word",
      overflowWrap: "break-word",
      padding: "10px",
    },
  },
  cells: {
    style: {
      padding: "7px",
      justifyContent: "center",
      borderBottom: "1px solid var(--green)",
      borderRight: "1px solid var(--green)",
    },
  },
};
export default AllAppointments;
