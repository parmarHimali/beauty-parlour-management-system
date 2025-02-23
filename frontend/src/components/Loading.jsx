import React from "react";
import ClipLoader from "react-spinners/esm/ClipLoader";

const Loading = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ClipLoader color="#000" size={40} />
    </div>
  );
};

export default Loading;
