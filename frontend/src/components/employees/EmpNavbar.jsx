import React from "react";
import { Link } from "react-router-dom";

const EmpNavbar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>Menu</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/emp/charts">Statistics</Link>
        </li>
        <li>
          <Link to="/emp/all">All Appointments</Link>
        </li>
        <li>
          <Link to="/emp/all-services">Services</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default EmpNavbar;
