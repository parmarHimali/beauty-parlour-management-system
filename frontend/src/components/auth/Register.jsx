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

const Register = ({ setIsRegistering }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const role = "User";
  const navigate = useNavigate();
  const { setIsAuthorized, setShowLogin } = useContext(UserContext);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/users/register",
        { name, email, password, role, phone },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("user registered successfully!");
      toast.success("otp sent to your email");
      localStorage.setItem("userEmail", email);
      navigate("/verifyEmail");
      setShowOTPInput(true);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setShowLogin(false);

      // setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return showOTPInput ? (
    <EmailVerify />
  ) : (
    <>
      <form onSubmit={handleRegister}>
        <div className="form-control">
          <label>Name</label>
          <div className="input-wrapper">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your Name"
            />
            <ImPencil2 />
          </div>
        </div>
        <div className="form-control">
          <label>Email Address</label>
          <div className="input-wrapper">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
            />
            <MdOutlineMailOutline />
          </div>
        </div>
        <div className="form-control">
          <label>Phone</label>
          <div className="input-wrapper">
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
            <FaPhoneAlt />
          </div>
        </div>
        <div className="form-control">
          <label>Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="**********"
            />
            <RiLock2Fill />
          </div>
        </div>
        <button type="submit">Register</button>
        <div className="login">
          Already have an account?{" "}
          <span
            onClick={() => setIsRegistering(false)}
            style={{ cursor: "pointer" }}
          >
            Login Now
          </span>
        </div>
      </form>
    </>
  );
};

export default Register;
