// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            logout();
            return;
          }

          // Set auth header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Get user data
          const response = await axios.get(`${apiUrl}/users/me`);
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token, apiUrl]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setToken(token);
      setCurrentUser(user);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
