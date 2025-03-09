import React, { useContext, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const BookForm = ({ showCart, setShowCart }) => {
  const [employees, setEmployees] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedTimes, setBookedTimes] = useState([]);
  const { user } = useContext(UserContext);
  const { sid } = useParams();

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

  const validationSchema = Yup.object().shape({
    employee: Yup.string().required("Please select an employee."),
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
    time: Yup.string().required("Please select a time."),
  });

  return (
    <div className={`auth-page ${showCart ? "show" : ""}`}>
      <div className="container">
        <MdClose className="close-btn" onClick={() => setShowCart(false)} />
        <div className="auth-heading">
          <h3>Book Appointment</h3>
        </div>

        <Formik
          initialValues={{ employee: "", date: "", time: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.post(
                `http://localhost:4000/api/appointment/book-appointment`,
                {
                  employeeId: values.employee,
                  date: values.date,
                  time: values.time,
                  serviceId: sid,
                  userId: user._id,
                  phone: user.phone,
                }
              );
              toast.success(response.data.message);
              setShowCart(false);
            } catch (error) {
              console.error("Error booking appointment:", error);
              toast.error(error?.response?.data?.message);
            }
            setSubmitting(false);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="form-control">
                <label>Select Employee:</label>
                <div className="input-wrapper">
                  <Field
                    as="select"
                    name="employee"
                    onChange={(e) => {
                      setFieldValue("employee", e.target.value);
                      if (e.target.value && values.date) {
                        fetchBookedTimes(e.target.value, values.date);
                        fetchAvailableTimes(e.target.value, values.date);
                      }
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

              <div className="form-control">
                <label>Select Date:</label>
                <div className="input-wrapper">
                  <Field
                    type="date"
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                      if (values.employee) {
                        fetchBookedTimes(values.employee, e.target.value);
                        fetchAvailableTimes(values.employee, e.target.value);
                      }
                    }}
                    disabled={!values.employee}
                  />
                  <ErrorMessage name="date" component="div" className="error" />
                </div>
              </div>

              <div className="form-control">
                <label>Select Time:</label>
                <div className="input-wrapper">
                  <Field as="select" name="time" disabled={!values.date}>
                    <option value="">Select Time</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="time" component="div" className="error" />
                </div>
              </div>

              <button type="submit">Book</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BookForm;
