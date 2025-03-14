import React from "react";
import UserNavbar from "../layout/UserNavbar";
import Footer from "../layout/Footer";
import { Outlet } from "react-router-dom";

const UserOutlet = () => {
  return (
    <>
      <UserNavbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserOutlet;
