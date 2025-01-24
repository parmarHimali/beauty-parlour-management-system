import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import Login from "../auth/Login";

const UserNavbar = () => {
  const { isAuthorized, setIsAuthorized, showLogin, setShowLogin } =
    useContext(UserContext);
  // const [showLogin, setShowLogin] = useState(false);
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

  const toggleLoginPopup = () => {
    setShowLogin((prev) => !prev); // Toggle the login popup visibility
  };

  return (
    <>
      <header>
        <h2 className="logo" style={{ color: "#973770" }}>
          Beauty & Bliss
        </h2>
        <nav className="navigation">
          <Link to={"/"} className="active">
            Home
          </Link>
          <Link to={"/categories"}>Services</Link>
          <Link to={"/about"}>About</Link>
          {isAuthorized ? (
            <>
              <Link to={"/book-appointment"}>Book Appointment</Link>
              <button className="btn btn-log" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="btn btn-log" onClick={toggleLoginPopup}>
              Login
            </button>
          )}
        </nav>
      </header>
      {showLogin && <Login setShowLogin={setShowLogin} />}
      {/* Only render Login if showLogin is true */}
    </>
  );
};

export default UserNavbar;
