import React from "react";

const RecentWork = () => {
  return (
    <div className="recent-container home">
      <div className="title-section">
        <h2>Our Recent Work</h2>
        <p>Experience the Art of Beauty</p>
      </div>
      <div className="recent-section">
        <img src={"/images/bride3.jpg"} alt="recent" />
        <img src={"/images/haircut.jpg"} alt="recent" />
        <img src={"/images/facial.jpg"} alt="recent" />
        <img src={"/images/gel.jpg"} alt="recent" />
      </div>
    </div>
  );
};

export default RecentWork;
