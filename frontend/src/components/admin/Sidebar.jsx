import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
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
          <input type="checkbox" id="category-toggle" className="menu-toggle" />
          <label htmlFor="category-toggle" className="btn-t btn-toggle">
            Categories
          </label>
          <ul className="submenu">
            <li>
              <Link to="/admin/add-category">Add Category</Link>
            </li>
            <li>
              <Link to="/admin/category-list">Manage Category</Link>
            </li>
          </ul>
        </li>
        <li>
          <input type="checkbox" id="services-toggle" className="menu-toggle" />
          <label htmlFor="services-toggle" className="btn-t btn-toggle">
            Services
          </label>
          <ul className="submenu">
            <li>
              <Link to="/admin/add-service">Add Service</Link>
            </li>
            <li>
              <Link to="/admin/service-list">Manage Services</Link>
            </li>
          </ul>
        </li>
        <li>
          <input
            type="checkbox"
            id="appointments-toggle"
            className="menu-toggle"
          />
          <label htmlFor="appointments-toggle" className="btn-t btn-toggle">
            Appointments
          </label>
          <ul className="submenu">
            {/* <li>
              <Link to="/admin/add-app">Add Appointment</Link>
            </li> */}
            <li>
              <Link to="/admin/all-app">All Appointment</Link>
            </li>
            <li>
              <Link to="/admin/today-app">Today Appointment</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/sales-report">Reports</Link>
        </li>
        <li>
          <Link to="/admin/add-employee">Add Employee</Link>
        </li>
        <li>
          <Link to="/admin/customer-list">Customer List</Link>
        </li>
        <li>
          <Link to="/admin/employee-list">Employee List</Link>
        </li>
        {/* 
        <li>
          <Link>Search Appointment</Link>
        </li> */}
      </ul>
    </nav>
  );
};

export default Sidebar;
