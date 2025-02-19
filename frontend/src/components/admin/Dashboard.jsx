import React from "react";
import CustomerChart from "./charts/CustomerChart";
import AppointmentChart from "./charts/AppointmentChart";
import MonthlyAppointmentsChart from "./charts/MonthlyAppointmentsChart";
import CurrMonthAppChart from "./charts/CurrMonthAppChart";

const Dashboard = () => {
  return (
    <>
      <h1 className="heading" style={{ textAlign: "center", fontSize: "34px" }}>
        Dashboard
      </h1>
      <CustomerChart />
      <MonthlyAppointmentsChart />
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
          maxwidth: "60%",
          padding: "10px 50px 30px",
        }}
      >
        <AppointmentChart />
        <CurrMonthAppChart />
      </div>
    </>
  );
};

export default Dashboard;
