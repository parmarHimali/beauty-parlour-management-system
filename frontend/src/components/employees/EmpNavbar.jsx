import axios from "axios";
import React, { useContext } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const EmpNavbar = () => {
  const { setIsAuthorized, isAuthorized } = useContext(UserContext);
  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/users/logout",
        { withCredentials: true }
      );
      toast.success(data.message);
      setIsAuthorized(false);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed.");
    }
  };
  return (
    <header>
      <h2 className="logo" style={{ color: "#973770" }}>
        Beauty & Bliss
      </h2>
      <nav className="navigation">
        <Link to={"/"} className="active">
          Dashboard
        </Link>
        <Link to={"/categories"}>Services</Link>
        <Link to={"/about"}>About</Link>
        <Link to={"/profile"}>Profile</Link>

        <button className="btn btn-log" onClick={isAuthorized && handleLogout}>
          {isAuthorized ? "Logout" : "Login"}
        </button>
      </nav>
    </header>
  );
};

export default EmpNavbar;
