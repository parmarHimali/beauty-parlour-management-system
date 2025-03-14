import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigateTo = useNavigate();
  return (
    <div className="not-found">
      <img src="/notfound.png" alt="" />
      <button onClick={() => navigateTo("/")}>Back to Home page</button>
    </div>
  );
};

export default NotFound;
