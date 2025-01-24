import axios from "axios";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import "../../admin.css";

const Header = () => {
  const { setIsAuthorized } = useContext(UserContext);
  const navigateTo = useNavigate();
  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/users/logout",
        { withCredentials: true }
      );
      toast.success(data.message);
      setIsAuthorized(false);
      navigateTo("/"); // Redirect to homepage after logout
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed.");
    }
  };
  return (
    <header className="topbar">
      <h2>B&B Admin Panel</h2>
      <div className="user-info">
        <a onClick={handleLogout} className="btn btn-green">
          Logout
        </a>
      </div>
    </header>
  );
};

export default Header;
