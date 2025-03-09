import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";
import { MdSearch } from "react-icons/md";
import Loading from "../Loading";
import { Link } from "react-router-dom";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:4000/api/users/getCustomers"
        );
        setCustomers(data.customers);
        setFilteredCustomers(data.customers.reverse());
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCustomers(
      customers.filter((customer) =>
        customer.name.toLowerCase().includes(query)
      )
    );
  };

  const handleDelete = async (cid) => {
    if (window.confirm("Are you sure to delete this customer?")) {
      try {
        setLoading(true);
        const { data } = await axios.delete(
          `http://localhost:4000/api/users/delete/${cid}`
        );
        toast.success(data.message);
        const updatedCustomers = customers.filter(
          (customer) => customer._id !== cid
        );
        setCustomers(updatedCustomers);
        setFilteredCustomers(updatedCustomers);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.phone, sortable: true },
    {
      name: "Account Created",
      selector: (row) => row.createdAt.split("T")[0],
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
      <div
        className="heading heading-container"
        style={{ width: "1050px", marginBottom: "5px" }}
      >
        <h2>Customer List</h2>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Search customer"
            value={searchQuery}
            onChange={handleSearch}
          />
          <MdSearch />
        </div>
      </div>
      <div className="data-table-container">
        <DataTable
          columns={columns}
          data={filteredCustomers}
          pagination
          highlightOnHover
          striped
          customStyles={customStyles}
          noDataComponent={
            <div
              style={{
                padding: "10px",
                fontSize: "16px",
                color: "var(--dark-green)",
              }}
            >
              No customers found
            </div>
          }
        />
      </div>
    </div>
  );
};

const customStyles = {
  table: {
    style: {
      width: "70vw",
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
      padding: "10px",
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

export default CustomerList;
