import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";
function EmailVerify() {
  const [code, setCode] = useState("");
  const { setIsAuthorized } = useContext(UserContext);
  const email = localStorage.getItem("userEmail");
  const navigate = useNavigate();
  const { setIsverified } = useContext(UserContext);
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    console.log("handle verify OTP");
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/users/verify-otp",
        { code },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(data);
      toast.success("Email verified successfully");
      setIsverified(true);
      setIsAuthorized(true);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid OTP");
      setIsverified(false);
      setIsAuthorized(false);
    }
  };
  const handleResendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/send-otp",
        { email }
      );
      console.log(response);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Error resending OTP.");
    }
  };
  return (
    // <div className={`auth-page ${showOTPInput ? "show" : ""}`}>
    <div className="otp-form">
      <div className="container">
        {/* <MdClose className="close-btn" onClick={() => setShowOTPInput(false)} /> */}
        <div className="auth-heading">
          <h3>Verify Email Address</h3>
        </div>
        <form onSubmit={handleVerifyOTP}>
          <div className="form-control">
            <label>Enter Otp:</label>
            <div className="input-wrapper">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button type="submit" className="btn-log">
              Verify
            </button>
          </div>
          <p style={{ fontSize: "15px" }}>
            Request a new one otp{" "}
            <span
              onClick={handleResendOTP}
              style={{ cursor: "pointer", color: "var(--pink-dark)" }}
            >
              here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default EmailVerify;
