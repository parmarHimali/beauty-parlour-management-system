import React from "react";

const HeroSection = () => {
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
        <a href="/book-appointment">
          <button className="btn btn-hero">Make Appointment</button>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
