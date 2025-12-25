/* eslint-disable react-refresh/only-export-components */

import { useState, useCallback, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api/axios"; // <-- required for cart fetching

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });

  const [loading, setLoading] = useState(true);

  //  NEW: cart count
  const [cartCount, setCartCount] = useState(0);

  //  NEW: refresh cart count
  const refreshCartCount = useCallback(async () => {
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await api.get("/cart");
      setCartCount(res.data.items?.length || 0);
    } catch {
      setCartCount(0);
    }
  }, [token]);

  // Load session once on startup
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);

    //  Load cart count on reload
    refreshCartCount();
  }, [refreshCartCount]);

  const setSession = useCallback((tokenValue, userObj) => {
    if (tokenValue && userObj) {
      localStorage.setItem("accessToken", tokenValue);
      localStorage.setItem("user", JSON.stringify(userObj));
      setToken(tokenValue);
      setUser(userObj);

      refreshCartCount(); //  Load cart after login
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      setCartCount(0); //  Reset cart on logout
    }
  }, [refreshCartCount]);

  const login = (tokenValue, userObj) => {
    setSession(tokenValue, userObj);
  };

  const register = (tokenValue, userObj) => {
    setSession(tokenValue, userObj);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setCartCount(0); //  Clear count
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setSession,
        login,
        register,
        logout,

        //  New values exposed to app
        cartCount,
        refreshCartCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
