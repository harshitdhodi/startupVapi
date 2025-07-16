import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("jwt");
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  const login = (token, rememberMe) => {
    Cookies.set("jwt", token, { expires: rememberMe ? 7 : undefined });
    setIsLoggedIn(true);
  };

  const logout = () => {
    Cookies.remove("jwt");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};