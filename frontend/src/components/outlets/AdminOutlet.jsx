import React from "react";
import Sidebar from "../admin/Sidebar";
import Header from "../admin/Header";
import { Outlet } from "react-router-dom";

const AdminOutlet = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminOutlet;
