import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import Loading from "../Loading";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:4000/api/employee/all"
        );
        setEmployees(data.employees);
        setFilteredEmployees(data.employees.reverse());
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredEmployees(
      employees.filter((employee) =>
        employee.userId.name.toLowerCase().includes(query)
      )
    );
  };

  const handleDelete = async (eid) => {
    if (window.confirm("Are you sure to delete this employee?")) {
      try {
        setLoading(true);
        const { data } = await axios.delete(
          `http://localhost:4000/api/employee/delete/${eid}`
        );
        toast.success(data.message);
        const updatedEmployees = employees.filter(
          (employee) => employee._id !== eid
        );
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    { name: "Name", selector: (row) => row.userId.name, sortable: true },
    { name: "Email", selector: (row) => row.userId.email, sortable: true },
    { name: "Phone", selector: (row) => row.userId.phone, sortable: true },
    { name: "Position", selector: (row) => row.position, sortable: true },
    {
      name: "Speciality",
      selector: (row) => row.speciality.map((spec) => spec.name).join(", "),
      wrap: true,
    },
    {
      name: "Salary",
      selector: (row) => `₹ ${row.salary || "0"}`,
      sortable: true,
    },
    {
      name: "Experience",
      selector: (row) => `${row.experience} Years`,
      sortable: true,
    },
    {
      name: "Account Created",
      selector: (row) => row.userId.createdAt.split("T")[0],
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <Link style={{ color: "red" }} onClick={() => handleDelete(row._id)}>
          Delete
        </Link>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="table-list">
      <div className="heading heading-container" style={{ width: "1220px" }}>
        <h2>Employee List</h2>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Search employee"
            value={searchQuery}
            onChange={handleSearch}
          />
          <MdSearch />
        </div>
      </div>
      <div className="data-table-container">
        <DataTable
          columns={columns}
          data={filteredEmployees}
          paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 30]}
          pagination
          highlightOnHover
          striped
          noDataComponent={
            <div
              style={{
                padding: "10px",
                fontSize: "16px",
                color: "var(--dark-green)",
              }}
            >
              No Employees found
            </div>
          }
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

const customStyles = {
  table: {
    style: {
      width: "80vw",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
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
    stripedStyle: {
      backgroundColor: "#e6f9e6",
    },
  },
  headCells: {
    style: {
      justifyContent: "center",
      textAlign: "center",
    },
  },

  cells: {
    style: {
      whiteSpace: "normal",
      wordBreak: "break-word",
      padding: "10px",
      whiteSpace: "normal",
      wordBreak: "break-word",
      overflow: "visible",
      justifyContent: "center",
      borderBottom: "1px solid var(--green)",
      borderRight: "1px solid var(--green)",
    },
  },
  pagination: {
    pageButtonsStyle: {
      color: "var(--dark-green)",
      fill: "var(--dark-green)",
      backgroundColor: "transparent",
      "&:hover": {
        color: "var(--green)",
        fill: "var(--green)",
        backgroundColor: "transparent",
      },
      "&:focus": {
        color: "var(--green)",
        fill: "var(--green)",
        backgroundColor: "transparent",
      },
      "&:disabled": {
        color: "var(--gray)",
        fill: "var(--gray)",
        backgroundColor: "transparent",
        cursor: "not-allowed",
        opacity: 0.6,
      },
    },
  },
};

export default EmployeeList;
