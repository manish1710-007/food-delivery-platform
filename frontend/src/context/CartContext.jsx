import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth"; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  // Wrap the function in useCallback so React knows it's stable
  const fetchCartCount = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const res = await api.get("/orders/cart");
      const items = res.data.items || [];
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (err) {
      console.error("Failed to load cart count", err);
    }
  }, [user]); // user is a dependency here

  // Now we can safely add fetchCartCount to the dependency array
  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

// Tell Vite's fast-refresh to ignore this specific export
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);