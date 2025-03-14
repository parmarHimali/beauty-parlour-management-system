import React, { useEffect, useState } from "react";
import CustomerChart from "./charts/CustomerChart";
import AppointmentChart from "./charts/AppointmentChart";
import MonthlyAppointmentsChart from "./charts/MonthlyAppointmentsChart";
import CurrMonthAppChart from "./charts/CurrMonthAppChart";

import EmpAppChart from "./charts/EmpAppChart";
import ServiceChart from "./charts/ServiceChart";
import { BASE_URL } from "../../App";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaUsers } from "react-icons/fa";
import { TfiUser } from "react-icons/tfi";
import { GoServer } from "react-icons/go";
import axios from "axios";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";

const Dashboard = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/users/count-list`);
        console.log(data);
        setData(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  console.log(data);

  return (
    <div style={{ marginBottom: "50px" }} className="dashboard">
      <h1 className="heading">Dashboard</h1>
      <div className="counter">
        <div className="cardCounter">
          <div className="icon">
            <LiaClipboardListSolid />
          </div>
          <h2 className="count">{data.totalAppointments}+</h2>
          <h2 className="text">Appointments</h2>
        </div>
        <div className="cardCounter">
          <div className="icon">
            <FaUsers />
          </div>
          <h2 className="count">{data.totalCustomers}+</h2>
          <h2 className="text">Customers</h2>
        </div>
        <div className="cardCounter">
          <div className="icon">
            <TfiUser />
          </div>
          <h2 className="count">{data.totalEmployees}+</h2>
          <h2 className="text">Employees</h2>
        </div>
        <div className="cardCounter">
          <div className="icon">
            <GoServer />
          </div>
          <h2 className="count">{data.totalServices}+</h2>
          <h2 className="text">Services</h2>
        </div>
        <div className="cardCounter">
          <div className="icon">
            <RiMoneyRupeeCircleFill />
          </div>
          <h2 className="count">{data.totalRevenue}+</h2>
          <h2 className="text">Revenue</h2>
        </div>
      </div>
      <div className="d-flex gap-2">
        <CustomerChart />
        <MonthlyAppointmentsChart />
      </div>
      <div className="d-flex gap-2">
        <AppointmentChart />
        <CurrMonthAppChart />
      </div>
      <EmpAppChart />
      <ServiceChart />
    </div>
  );
};

export default Dashboard;
