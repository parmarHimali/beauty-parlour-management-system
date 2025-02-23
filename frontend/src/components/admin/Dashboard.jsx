import React, { useState } from "react";
import CustomerChart from "./charts/CustomerChart";
import AppointmentChart from "./charts/AppointmentChart";
import MonthlyAppointmentsChart from "./charts/MonthlyAppointmentsChart";
import CurrMonthAppChart from "./charts/CurrMonthAppChart";
import Loading from "../Loading";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <h1 className="heading" style={{ textAlign: "center", fontSize: "34px" }}>
        Dashboard
      </h1>
      <CustomerChart setLoading={setLoading} loading={loading} />
      <MonthlyAppointmentsChart setLoading={setLoading} loading={loading} />
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
        <AppointmentChart setLoading={setLoading} loading={loading} />
        <CurrMonthAppChart setLoading={setLoading} loading={loading} />
      </div>
    </>
  );
};

export default Dashboard;
