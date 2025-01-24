import React from "react";

const ServiceSection = () => {
  return (
    <div className="service-container home">
      <div className="title-section">
        <h2>Services</h2>
        <p>The Best For You</p>
      </div>
      <div className="service-section">
        <div className="service">
          <img src="./images/sicons/makeup.png" alt="makeup" width="130px" />
          <h3>Makeup</h3>
        </div>
        <div className="service">
          <img
            src={"/images/sicons/eyebrow-pencil.png"}
            alt="eyebrow"
            width="130px"
          />
          <h3>Eyebrow Design</h3>
        </div>
        <div className="service">
          <img
            src={"/images/sicons/woman-hair.png"}
            alt="haircut"
            width="130px"
          />
          <h3>Haircut</h3>
        </div>
        <div className="service">
          <img src={"/images/sicons/braid.png"} alt="hairstyle" width="130px" />
          <h3>Hairstyle</h3>
        </div>
        <div className="service">
          <img src={"/images/sicons/nail.png"} alt="manicure" width="130px" />
          <h3>Manicure</h3>
        </div>
        <div className="service">
          <img
            src={"/images/sicons/pedicure.png"}
            alt="pedicure"
            width="130px"
          />
          <h3>Pedicure</h3>
        </div>
        <div className="service">
          <img src={"/images/sicons/waxing.png"} alt="waxing" width="130px" />
          <h3>Waxing</h3>
        </div>
        <div className="service">
          <img
            src={"/images/sicons/face-cleanser.png"}
            alt="skin cleansing"
            width="130px"
          />
          <h3>Skin Cleensing</h3>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
