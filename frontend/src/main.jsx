import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AppWrapper } from "./context/userContext.jsx";
import CartWrapper from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AppWrapper>
    <CartWrapper>
      <App />
    </CartWrapper>
  </AppWrapper>
  // </StrictMode>
);
