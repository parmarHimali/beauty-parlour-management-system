import React from "react";
import CustomerChart from "./charts/CustomerChart";

const Dashboard = () => {
  return (
    <>
      <h1 className="heading" style={{ textAlign: "center", fontSize: "34px" }}>
        Dashboard
      </h1>
      <CustomerChart />
    </>
  );
};

export default Dashboard;
