import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
// import "./components/media.css";
import { AppWrapper } from "./context/userContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AppWrapper>
    <App />
  </AppWrapper>
  // </StrictMode>
);
