import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

const CartWrapper = ({ children }) => {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart-data")) || []
  );
  const [showCart, setShowCart] = useState(false);
  useEffect(() => {
    localStorage.setItem("cart-data", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart, showCart, setShowCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartWrapper;
