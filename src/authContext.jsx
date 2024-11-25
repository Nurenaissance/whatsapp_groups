import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticatedGroup, setIsAuthenticatedGroup] = useState(() => {
    return localStorage.getItem("isAuthenticatedGroup") === "true";
  });

  const [userDetails, setUserDetails] = useState(() => {
    const storedDetails = localStorage.getItem("userDetails");
    return storedDetails ? JSON.parse(storedDetails) : null;
  });

  useEffect(() => {
    localStorage.setItem("isAuthenticatedGroup", isAuthenticatedGroup);
  }, [isAuthenticatedGroup]);

  useEffect(() => {
    if (userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    } else {
      localStorage.removeItem("userDetails");
    }
  }, [userDetails]);

  const login = (userData) => {
    setIsAuthenticatedGroup(true);
    setUserDetails(userData);
  };

  const logout = () => {
    setIsAuthenticatedGroup(false);
    setUserDetails(null);
    localStorage.clear(); // Optional: clear all local storage
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticatedGroup, 
        userDetails, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};