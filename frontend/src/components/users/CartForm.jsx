import React, { useContext, useEffect, useState } from "react";
import { MdClose, MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { UserContext } from "../../context/userContext";
import { useParams } from "react-router-dom";
import axios from "axios";

const CartForm = ({ showCart, setShowCart, setCart }) => {
  //   const { setCart } = useContext(UserContext);
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const { sid } = useParams();

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployee(employeeId);
    if (employeeId && selectedDate) {
      fetchBookedTimes(employeeId, selectedDate);
      fetchAvailableTimes(employeeId, selectedDate);
    }
  };
  const fetchBookedTimes = async (employeeId, date) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/appointment/booked-times/${employeeId}/${date}`
    );
    setBookedTimes(data.bookedTimes);
  };

  const fetchAvailableTimes = async (employeeId, date) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/appointment/available-times/${employeeId}/${date}`
    );

    setAvailableTimes(data.availableTimes);
  };
  useEffect(() => {
    const fetchEmployeesByService = async (serviceId) => {
      const { data } = await axios.get(
        `http://localhost:4000/api/employee/service/${serviceId}`
      );
      setEmployees(data.employees);
    };
    fetchEmployeesByService(sid);
  }, []);

  const handleDateChange = (e) => {
    const date = e.target.value;
    console.log(date);
    console.log(selectedEmployee);

    setSelectedDate(date);
    if (selectedEmployee) {
      fetchBookedTimes(selectedEmployee, date);
      fetchAvailableTimes(selectedEmployee, date);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    const time = e.target.time.value;
    setCart([
      ...CartForm,
      {
        serviceId: sid,
        date: selectedDate,
        time: time,
        employee: selectedEmployee,
      },
    ]);
  };
  return (
    <div className={`auth-page ${showCart ? "show" : ""}`}>
      <h2>hello</h2>
      <div className="container">
        <MdClose className="close-btn" onClick={() => setShowCart(false)} />
        <div className="auth-heading">
          <h3>Book appointment</h3>
        </div>

        <form onSubmit={handleAddToCart}>
          <div className="form-control">
            <label>Select Employee:</label>
            <div className="input-wrapper">
              <select
                name="employee"
                id="employee"
                onChange={handleEmployeeChange}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.userId.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label htmlFor="date">Select Date:</label>
              <div className="input-wrapper">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={handleDateChange}
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <label htmlFor="time">Select Time:</label>
              <div className="input-wrapper">
                <select name="time" id="time" required>
                  <option value="">Select Time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button type="submit">Book</button>
        </form>
      </div>
    </div>
  );
};

export default CartForm;
