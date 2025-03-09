import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/appointment/today-appointments"
      );
      setAppointments(data.allAppointments);
      setFilteredAppointments(data.allAppointments.reverse());
    } catch (error) {
      toast.error("Failed to fetch today's appointments");
    }
  };

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
  const handleDelete = async (aid) => {
    const isDlt = confirm("Are you sure to delete appointment?");
    if (isDlt) {
      try {
        const { data } = await axios.delete(
          `http://localhost:4000/api/appointment/delete/${aid}`
        );
        toast.success(data.message);
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment.appointmentId !== aid
          )
        );
        setFilteredAppointments((prevFiltered) =>
          prevFiltered.filter(
            (appointment) => appointment.appointmentId !== aid
          )
        );
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    }
  };
  const columns = [
    { name: "Customer", selector: (row) => row.customerName, sortable: true },
    {
      name: "Service",
      selector: (row) => row.serviceName,
      sortable: true,
      wrap: true,
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
          row.serviceDuration % 60 === 0 ? "" : `${row.serviceDuration % 60}m`
        }`,
      maxWidth: "20px",
      sortable: true,
      wrap: true,
    },
    { name: "Date", selector: (row) => row.date, sortable: true },
    {
      name: "Time",
      selector: (row) => row.time,
      sortable: true,
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
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            style={{ color: "var(--dark-green)" }}
            to={`/admin/appointment/${row.appointmentId}`}
          >
            View
          </Link>
          <Link
            style={{ color: "red" }}
            onClick={() => handleDelete(row.appointmentId)}
          >
            Delete
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="appointments-list">
      <div className="heading heading-container">
        <h2>Today's Appointments</h2>
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
        paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
        responsive
        customStyles={customStyles}
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
  rows: { style: { textAlign: "center", fontSize: "14px", fontWeight: "500" } },
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

export default TodayAppointments;
