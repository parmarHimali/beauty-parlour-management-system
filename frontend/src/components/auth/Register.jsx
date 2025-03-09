// import React, { useContext, useState } from "react";
// import { MdOutlineMailOutline } from "react-icons/md";
// import { RiLock2Fill } from "react-icons/ri";
// import { ImPencil2 } from "react-icons/im";
// import { FaPhoneAlt } from "react-icons/fa";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { UserContext } from "../../context/userContext";
// import EmailVerify from "./EmailVerify";
// import { useNavigate } from "react-router-dom";

// const Register = ({ setIsRegistering }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const role = "User";
//   const navigate = useNavigate();
//   const { setIsAuthorized, setShowLogin } = useContext(UserContext);
//   const [showOTPInput, setShowOTPInput] = useState(false);
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(
//         "http://localhost:4000/api/users/register",
//         { name, email, password, role, phone },
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       toast.success("user registered successfully!");
//       toast.success("otp sent to your email");
//       localStorage.setItem("userEmail", email);
//       navigate("/verifyEmail");
//       setShowOTPInput(true);
//       setName("");
//       setEmail("");
//       setPassword("");
//       setPhone("");
//       setShowLogin(false);

//       // setIsAuthorized(true);
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   return showOTPInput ? (
//     <EmailVerify />
//   ) : (
//     <>
//       <form onSubmit={handleRegister}>
//         <div className="form-control">
//           <label>Name</label>
//           <div className="input-wrapper">
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter your Name"
//             />
//             <ImPencil2 />
//           </div>
//         </div>
//         <div className="form-control">
//           <label>Email Address</label>
//           <div className="input-wrapper">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your Email"
//             />
//             <MdOutlineMailOutline />
//           </div>
//         </div>
//         <div className="form-control">
//           <label>Phone</label>
//           <div className="input-wrapper">
//             <input
//               type="number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               placeholder="Enter phone number"
//             />
//             <FaPhoneAlt />
//           </div>
//         </div>
//         <div className="form-control">
//           <label>Password</label>
//           <div className="input-wrapper">
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="**********"
//             />
//             <RiLock2Fill />
//           </div>
//         </div>
//         <button type="submit">Register</button>
//         <div className="login">
//           Already have an account?{" "}
//           <span
//             onClick={() => setIsRegistering(false)}
//             style={{ cursor: "pointer" }}
//           >
//             Login Now
//           </span>
//         </div>
//       </form>
//     </>
//   );
// };

// export default Register;
import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { ImPencil2 } from "react-icons/im";
import { FaPhoneAlt } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import EmailVerify from "./EmailVerify";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = ({ setIsRegistering }) => {
  const navigate = useNavigate();
  const { setShowLogin } = useContext(UserContext);
  const [showOTPInput, setShowOTPInput] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required("Name is required")
      .matches(/^[A-Za-z ]+$/, "Name can only contain alphabets")
      .min(3, "Name must contain atleast 3 characters")
      .max(50, "Name cannot exceed 50 characters"),
    email: Yup.string()
      .trim()
      .required("Email is required")
      .matches(
        /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$/,
        "Please provide valid email address"
      )
      .max(255, "email cannot exceed 255 characters"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleRegister = async (values, { setSubmitting, resetForm }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/users/register",
        { ...values, role: "User" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("User registered successfully!");
      toast.success("OTP sent to your email");
      localStorage.setItem("userEmail", values.email);
      navigate("/verifyEmail");
      setShowOTPInput(true);
      resetForm();
      setShowLogin(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
    setSubmitting(false);
  };

  return showOTPInput ? (
    <EmailVerify />
  ) : (
    <Formik
      initialValues={{ name: "", email: "", phone: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleRegister}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-control">
            <label>Name</label>
            <div className="input-wrapper">
              <Field
                type="text"
                name="name"
                placeholder="Enter your Name"
                maxLength={50}
              />
              <ImPencil2 />
            </div>
            <ErrorMessage name="name" component="div" className="error" />
          </div>

          <div className="form-control">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Field
                type="email"
                name="email"
                placeholder="Enter your Email"
                maxLength={255}
              />
              <MdOutlineMailOutline />
            </div>
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div className="form-control">
            <label>Phone</label>
            <div className="input-wrapper">
              <Field
                type="text"
                name="phone"
                placeholder="Enter phone number"
              />
              <FaPhoneAlt />
            </div>
            <ErrorMessage name="phone" component="div" className="error" />
          </div>

          <div className="form-control">
            <label>Password</label>
            <div className="input-wrapper">
              <Field type="password" name="password" placeholder="**********" />
              <RiLock2Fill />
            </div>
            <ErrorMessage name="password" component="div" className="error" />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>

          <div className="login">
            Already have an account?{" "}
            <span
              onClick={() => setIsRegistering(false)}
              style={{ cursor: "pointer" }}
            >
              Login Now
            </span>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Register;
