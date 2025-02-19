import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./../../context/UserContext";
import { toast } from "react-hot-toast";

const HeroSection = () => {
  const navigateTo = useNavigate();
  const { user, setShowLogin } = useContext(UserContext);
  const handleApp = () => {
    if (user?.role == "User") {
      navigateTo("/book-appointment");
    } else {
      toast.error("Please login first to make appointment");
      setShowLogin(true);
    }
  };
  return (
    <section className="hero">
      <img
        src={"/images/bg_img.png"}
        width="800px"
        className="hero-img"
        alt="hero section image"
      />

      <div id="content">
        <h2>Your Beauty, Our Passion.</h2>
        <p>
          Discover your best self with our expert beauty services, crafted to
          make you look and feel radiant. Your journey to confidence starts
          here.
        </p>
        <button className="btn btn-hero" onClick={handleApp}>
          Make Appointment
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
