import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineMailOutline, MdClose } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Register from "./Register";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);

  const { setIsAuthorized, setShowLogin } = useContext(UserContext);
  const navigateTo = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .required("Email is required")
      .matches(
        /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$/,
        "Please provide valid email address"
      )
      .max(255, "email cannot exceed 255 characters"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/users/login",
        values,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(data);

      toast.success(data.message);
      setIsAuthorized(true);
      setShowLogin(false);
      console.log(data);

      if (data.user.role === "Admin") navigateTo("/");
      if (data.user.role === "Employee") navigateTo("/");
      if (data.user.role === "User") navigateTo("/");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.isVerified == false) {
        setShowLogin(false);
        navigateTo("/verifyEmail");
      }
      toast.error(error.response?.data?.message || "Login failed");
      setIsAuthorized(false);
    }
    setSubmitting(false);
  };

  const handleForgotPassword = async (email) => {
    console.log(email);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/users/forgot-password",
        { email },
        {
          // withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className={`auth-page ${setShowLogin ? "show" : ""}`}>
      <div className="container">
        <MdClose className="close-btn" onClick={() => setShowLogin(false)} />
        <div className="auth-heading">
          <h3>
            {isRegistering ? "Create new account" : "Login to your account"}
          </h3>
        </div>
        {isRegistering ? (
          <Register
            setIsRegistering={setIsRegistering}
            setShowLogin={setShowLogin}
            showOTPInput={showOTPInput}
            setShowOTPInput={setShowOTPInput}
          />
        ) : (
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, values }) => (
              <Form>
                <div className="form-control">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <Field
                      type="email"
                      name="email"
                      placeholder="abc@gmail.com"
                    />
                    <MdOutlineMailOutline />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-control">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <Field
                      type="password"
                      name="password"
                      placeholder="**********"
                    />
                    <RiLock2Fill />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error"
                  />
                </div>

                <button type="submit" disabled={isSubmitting}>
                  Login
                </button>
                {/* <div>
                  <a
                    onClick={() => handleForgotPassword(values.email)}
                    style={{ color: "black" }}
                  >
                    forgot password ?{" "}
                  </a>
                </div> */}
                <div className="register">
                  Don't have an account?
                  <span
                    onClick={() => setIsRegistering(true)}
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    Register Now
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default Login;
