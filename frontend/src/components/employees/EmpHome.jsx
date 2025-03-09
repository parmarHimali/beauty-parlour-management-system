import React from "react";
import EmployeeCharts from "./charts/EmployeeCharts";
import EmployeeCalendar from "./EmployeeCalendar";

const EmpHome = () => {
  return (
    <div className="emp-chart-container">
      <EmployeeCharts />
      {/* <EmployeeCalendar /> */}
    </div>
  );
};

export default EmpHome;
