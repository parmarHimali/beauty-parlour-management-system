import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/employee/all"
        );
        console.log(data.employees[0]);

        setEmployees(data.employees);
        setFilteredEmployees(data.employees.reverse());
      } catch (error) {
        console.log(error);
      }
    };
    fetchEmployees();
  }, []);
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredEmployees(
      employees.filter((employee) => {
        return employee.userId.name.toLowerCase().includes(query);
      })
    );
  };
  const handleDelete = async (eid) => {
    const isDlt = confirm("Are you sure to Delete this employee?");
    if (isDlt) {
      try {
        const { data } = await axios.delete(
          `http://localhost:4000/api/employee/delete/${eid}`
        );
        toast.success(data.message);
        const updatedEmployees = employees.filter((employee) => {
          return employee._id !== eid;
        });
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message);
      }
    }
  };
  return (
    <div className="table-list">
      <div className="heading heading-container">
        <h2>Employee List</h2>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="search employee"
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
            <th>Position</th>
            <th>Speciality</th>
            <th>Salary</th>
            <th>Experience</th>
            <th>Account Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => {
              return (
                <tr key={employee._id}>
                  <td>{employee.userId.name}</td>
                  <td>{employee.userId.email}</td>
                  <td>{employee.userId.phone}</td>
                  <td>{employee.position}</td>
                  <td>
                    <ul style={{ listStyle: "none" }}>
                      {employee.speciality &&
                        employee.speciality.map((spec) => {
                          return <li key={spec._id}>{spec.name}</li>;
                        })}
                    </ul>
                  </td>
                  <td>₹ {employee?.salary || "0"}</td>
                  <td>{employee.experience} Year</td>
                  <td>{employee.userId.createdAt.split("T")[0]}</td>
                  <td>
                    <Link
                      style={{ color: "red" }}
                      onClick={() => handleDelete(employee._id)}
                    >
                      Delete
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9">No Employee found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
