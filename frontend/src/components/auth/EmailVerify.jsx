import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";
function EmailVerify() {
  const [code, setCode] = useState("");
  const email = localStorage.getItem("userEmail");
  const navigate = useNavigate();
  const { isVerified, setIsverified } = useContext(UserContext);
  const handleVerifyOTP = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/users/verify-otp",
        { code },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Email verified successfully");
      setIsverified(true);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Invalid OTP");
      setIsverified(false);
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
    <div>
      <div>
        Enter Otp:
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <div>
        <input
          type="submit"
          onClick={handleVerifyOTP}
          value="Verify OTP"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        />
      </div>
      <p style={{ fontSize: "15px" }}>
        Request a new one otp{" "}
        <a
          onClick={handleResendOTP}
          style={{ color: "blue", fontSize: "15px" }}
        >
          here
        </a>{" "}
      </p>
    </div>
  );
}

export default EmailVerify;
