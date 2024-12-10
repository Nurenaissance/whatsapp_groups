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

  const login = (userData) => {
    setIsAuthenticatedGroup(true);
    setUserDetails(userData);
    // Store authentication state and user details in localStorage
    localStorage.setItem("isAuthenticatedGroup", "true");
    localStorage.setItem("userDetails", JSON.stringify(userData));
    // Store tenant ID in localStorage
    localStorage.setItem("tenantId", userData.tenantId);
  };

  const logout = () => {
    setIsAuthenticatedGroup(false);
    setUserDetails(null);
    // Clear specific authentication-related items
    localStorage.removeItem("isAuthenticatedGroup");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("tenantId");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticatedGroup, 
        userDetails, 
        login, 
        logout,
        tenantId: localStorage.getItem("tenantId") // Add this
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

export default AuthContext;