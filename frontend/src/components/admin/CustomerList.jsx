import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/users/getCustomers"
        );
        setCustomers(data.customers);
        setFilteredCustomers(data.customers.reverse());
      } catch (error) {
        console.log(error);
      }
    };
    fetchCustomers();
  }, []);
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCustomers(
      customers.filter((customer) => {
        console.log(query);

        console.log(customer.name.toLowerCase().includes(query));
        return customer.name.toLowerCase().includes(query);
      })
    );
  };

  const handleDelete = async (cid) => {
    const isDlt = confirm("are you sure to delete customer?");
    if (isDlt) {
      try {
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
      }
    }
  };
  return (
    <div className="table-list">
      <div className="heading heading-container">
        <h2>Customer List</h2>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="search customer"
            value={searchQuery}
            onChange={handleSearch}
          />
          <MdSearch />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Account Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => {
              return (
                <tr key={customer._id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.createdAt.split("T")[0]}</td>
                  <td>
                    <Link
                      style={{ color: "red" }}
                      onClick={() => handleDelete(customer._id)}
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
