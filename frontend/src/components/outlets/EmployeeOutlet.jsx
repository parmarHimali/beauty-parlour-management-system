import React from "react";
import EmpHeader from "../employees/EmpHeader";
import { Outlet } from "react-router-dom";
import EmpNavbar from "../employees/EmpNavbar";

const EmployeeOutlet = () => {
  return (
    <div className="dashboard-container">
      <EmpNavbar />
      <div className="main-content">
        <EmpHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeOutlet;
