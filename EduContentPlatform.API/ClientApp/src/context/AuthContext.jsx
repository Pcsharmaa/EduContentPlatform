import React, { createContext, useState, useContext, useEffect } from "react";
import { authService } from "../services/api/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setError("");
      const data = await authService.login(credentials);
      setUser(data.data.user);
      navigate("/dashboard");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError("");
      const data = await authService.register(userData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate("/login");
  };

  const forgotPassword = async (email) => {
    try {
      setError("");
      const data = await authService.forgotPassword(email);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setError("");
      const data = await authService.resetPassword(token, newPassword);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
    isAuthenticated: !!user,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
