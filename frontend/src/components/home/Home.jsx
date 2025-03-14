import React, { useContext, useEffect } from "react";
import HeroSection from "./HeroSection";
import RecentWork from "./RecentWork";
import ServiceSection from "./ServiceSection";
import Review from "./Review";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { isAuthorized } = useContext(UserContext);
  const navigateTo = useNavigate();
  // console.log(isAuthorized);

  // useEffect(() => {
  //   if (!isAuthorized) {
  //     navigateTo("/login");
  //   }
  // }, [isAuthorized]);

  return (
    <>
      <HeroSection />
      <hr />
      <RecentWork />
      <hr />
      <Review />
      <hr />
      <ServiceSection />
      <hr />
    </>
  );
};

export default Home;
