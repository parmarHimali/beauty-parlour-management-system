import React, { useContext, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";

const CartForm = ({ showCart, setShowCart }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const { user } = useContext(UserContext);

  const { sid } = useParams();

  // Fetch employees for the selected service
  useEffect(() => {
    const fetchEmployeesByService = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/employee/service/${sid}`
        );
        setEmployees(data.employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployeesByService();
  }, [sid]);

  const handleEmployeeChange = async (e) => {
    const employeeId = e.target.value;
    setSelectedEmployee(employeeId);
    if (employeeId && selectedDate) {
      await fetchBookedTimes(employeeId, selectedDate);
      await fetchAvailableTimes(employeeId, selectedDate);
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (selectedEmployee) {
      await fetchBookedTimes(selectedEmployee, date);
      await fetchAvailableTimes(selectedEmployee, date);
    }
  };

  const fetchBookedTimes = async (employeeId, date) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/appointment/booked-times/${employeeId}/${date}`
      );
      setBookedTimes(data.bookedTimes);
    } catch (error) {
      console.error("Error fetching booked times:", error);
    }
  };

  const fetchAvailableTimes = async (employeeId, date) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/appointment/available-times/${employeeId}/${date}`
      );
      setAvailableTimes(data.availableTimes);
    } catch (error) {
      console.error("Error fetching available times:", error);
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedDate || !selectedTime) {
      alert("Please select all fields.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/appointment/book-appointment`,
        {
          employeeId: selectedEmployee,
          date: selectedDate,
          time: selectedTime,
          serviceId: sid,
          userId: user._id,
          phone: user.phone,
        }
      );
      // alert(response.data.message);
      toast.success(response.data.message);
      setShowCart(false); // Close the modal after booking
    } catch (error) {
      console.error("Error booking appointment:", error);
      // alert("Failed to book appointment.");
      toast.error("Failed to book appointment.");
    }
  };

  return (
    <div className={`auth-page ${showCart ? "show" : ""}`}>
      <div className="container">
        <MdClose className="close-btn" onClick={() => setShowCart(false)} />
        <div className="auth-heading">
          <h3>Book Appointment</h3>
        </div>

        <form onSubmit={handleAddToCart}>
          {/* Employee Selection */}
          <div className="form-control">
            <label>Select Employee:</label>
            <div className="input-wrapper">
              <select onChange={handleEmployeeChange} required>
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.userId.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Selection */}
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

          {/* Time Selection */}
          <div className="form-control">
            <label htmlFor="time">Select Time:</label>
            <div className="input-wrapper">
              <select onChange={handleTimeChange} required>
                <option value="">Select Time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit">Book</button>
        </form>
      </div>
    </div>
  );
};

export default CartForm;
