import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

const BookAppointment = () => {
  const { user } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/category/all-categories"
      );
      setCategories(data.categories);
    };
    fetchCategories();
  }, [categories]);

  const fetchServicesByCategory = async (categoryId) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/services/${categoryId}`
    );
    setServices(data.services);
  };

  const fetchEmployeesByService = async (serviceId) => {
    const { data } = await axios.get(
      `http://localhost:4000/api/employee/service/${serviceId}`
    );
    setEmployees(data.employees);
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

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (categoryId) fetchServicesByCategory(categoryId);
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedService(serviceId);
    if (serviceId) fetchEmployeesByService(serviceId);
  };

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployee(employeeId);
    if (employeeId && selectedDate) {
      fetchBookedTimes(employeeId, selectedDate);
      fetchAvailableTimes(employeeId, selectedDate);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const time = e.target.time.value;

    try {
      const response = await axios.post(
        "http://localhost:4000/api/appointment/book-appointment",
        {
          userId: user._id,
          phone: user.phone,
          categoryId: selectedCategory,
          serviceId: selectedService,
          employeeId: selectedEmployee,
          date: selectedDate,
          time,
        }
      );
      toast.success("Appointment booked successfully!");
      setCategories([]);
      setServices([]);
      setEmployees([]);
      setSelectedCategory("");
      setSelectedService("");
      setSelectedDate("");
      setAvailableTimes([]);
      setSelectedEmployee("");
      setBookedTimes([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to book the appointment.");
    }
  };

  return (
    <div className="appointment">
      <div className="container" style={{ marginTop: "15px" }}>
        <div className="app-heading">
          <h3>Book an Appointment</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="customer_name">Name:</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Enter your Name"
                value={user.name}
                readOnly
                required
              />
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="phone">Phone:</label>
            <div className="input-wrapper">
              <input
                type="number"
                placeholder="Enter your Phone number"
                value={user.phone}
                readOnly
                required
              />
            </div>
          </div>
          <div className="form-control two-control">
            <div>
              <label htmlFor="category">Select Category:</label>
              <div className="input-wrapper">
                <select
                  name="category"
                  id="category"
                  onChange={handleCategoryChange}
                  required
                >
                  <option>Select Category</option>
                  {categories?.map((category) => (
                    <option value={category._id} key={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="service">Select Service:</label>
              <div className="input-wrapper">
                <select
                  name="service"
                  id="service"
                  onChange={handleServiceChange}
                  required
                >
                  <option value="">Select Service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="employee">Select Service Provider:</label>
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
          </div>

          <div className="form-control two-control">
            <div>
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
            <div>
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

          <button type="submit">Book Appointment</button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
