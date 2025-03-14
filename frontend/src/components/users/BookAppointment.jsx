import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const { user, isAuthorized, setShowLogin } = useContext(UserContext);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const navigateTo = useNavigate();
  useEffect(() => {
    if (!isAuthorized) {
      setShowLogin(true);
      navigateTo("/");
    }
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/category/all-categories"
        );
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // toast.error("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  const fetchServicesByCategory = async (categoryId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/services/${categoryId}`
      );
      setServices(data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
      // toast.error("Failed to fetch services.");
    }
  };

  const fetchEmployeesByService = async (serviceId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/employee/service/${serviceId}`
      );
      setEmployees(data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      // toast.error("Failed to fetch employees.");
    }
  };

  const fetchAvailableTimes = async (employeeId, date) => {
    console.log(employeeId, date);

    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/appointment/available-times/${employeeId}/${date}`
      );
      setAvailableTimes(data.availableTimes);
    } catch (error) {
      console.error("Error fetching available times:", error);
      // toast.error("Failed to fetch available times.");
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post(
        "http://localhost:4000/api/appointment/book-appointment",
        {
          userId: user._id,
          phone: values.phone,
          customerName: values.name,
          serviceId: values.service,
          employeeId: values.employee,
          date: values.date,
          time: values.time,
        }
      );

      toast.success("Appointment booked successfully!");
      resetForm();
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(
        error?.response?.data?.message || "Failed to book the appointment."
      );
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .matches(/^[A-Za-z ]+$/, "Name must only contain alphabets")
      .max(50, "Name cannot exceed 50 characters")
      .min(3, "Name must contain atleast 3 characters"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    category: Yup.string().required("Category is required"),
    service: Yup.string().required("Service is required"),
    employee: Yup.string().required("Employee selection is required"),
    date: Yup.date()
      .min(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ),
        "Date must be today or in the future"
      )
      .required("Date is required"),
    time: Yup.string().required("Time is required"),
  });

  return (
    <div className="app-container" style={{ marginTop: "15px" }}>
      <div className="form-section">
        <Formik
          initialValues={{
            name: user?.role === "User" ? user.name : "",
            phone: user?.role === "User" ? user.phone : "",
            category: "",
            service: "",
            employee: "",
            date: "",
            time: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form
              className={user?.role === "User" ? "user-form" : "admin-form"}
              noValidate
            >
              <h3
                className="title"
                style={{
                  color: user?.role === "User" ? "var(--pink-dark)" : "",
                }}
              >
                Book an Appointment
              </h3>

              <div className="form-control">
                <label htmlFor="name">Name:</label>
                <div className="input-wrapper">
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter your Name"
                    maxLength={50}
                  />
                  <ErrorMessage name="name" component="div" className="error" />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="phone">Phone:</label>
                <div className="input-wrapper">
                  <Field
                    type="text"
                    name="phone"
                    placeholder="Enter your Phone number"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error"
                  />
                </div>
              </div>

              <div className="form-control two-control">
                <div>
                  <label htmlFor="category">Select Category:</label>
                  <div className="input-wrapper">
                    <Field
                      as="select"
                      name="category"
                      onChange={(e) => {
                        setFieldValue("category", e.target.value);
                        fetchServicesByCategory(e.target.value);
                        setFieldValue("service", "");
                        setFieldValue("employee", "");
                        setFieldValue("time", "");
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service">Select Service:</label>
                  <div className="input-wrapper">
                    <Field
                      as="select"
                      name="service"
                      disabled={!values.category}
                      onChange={(e) => {
                        setFieldValue("service", e.target.value);
                        fetchEmployeesByService(e.target.value);
                        setFieldValue("employee", "");
                        setFieldValue("time", "");
                      }}
                    >
                      <option value="">Select Service</option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="service"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="employee">Select Service Provider:</label>
                <div className="input-wrapper">
                  <Field
                    as="select"
                    name="employee"
                    disabled={!values.service}
                    onChange={(e) => {
                      setFieldValue("employee", e.target.value);
                      // fetchAvailableTimes(e.target.value, values.date);
                    }}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.userId.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="employee"
                    component="div"
                    className="error"
                  />
                </div>
              </div>

              <div className="form-control two-control">
                <div>
                  <label htmlFor="date">Select Date:</label>
                  <div className="input-wrapper">
                    <Field
                      type="date"
                      name="date"
                      min={new Date().toISOString().split("T")[0]}
                      disabled={!values.employee}
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                        fetchAvailableTimes(values.employee, e.target.value);
                      }}
                    />
                    <ErrorMessage
                      name="date"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="time">Select Time:</label>
                  <div className="input-wrapper">
                    <Field as="select" name="time" disabled={!values.date}>
                      <option value="">Select Time</option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="time"
                      component="div"
                      className="error"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={user?.role === "User" ? "" : "btn-green"}
              >
                Book Appointment
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BookAppointment;
