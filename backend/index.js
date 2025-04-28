// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            // Token expired
            console.log("Token expired");
            logout();
            return;
          }

          // Verify token with backend
          const result = await ApiService.verifyToken();
          
          if (result.success) {
            setCurrentUser(result.data.user);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          setError("Authentication error. Please log in again.");
          logout();
        }
      }
      
      setLoading(false);
    };

    verifyToken();
  }, []);

  const loginUser = async (email, password) => {
    setError(null);
    
    try {
      const result = await ApiService.login(email, password);
      
      if (result.success) {
        setCurrentUser(result.data.user || result.data);
        return { success: true, user: result.data.user || result.data };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const loginAdmin = async (email, password) => {
    setError(null);
    
    try {
      const result = await ApiService.loginAdmin(email, password);
      
      if (result.success) {
        setCurrentUser(result.data.user || result.data);
        return { success: true, user: result.data.user || result.data };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Admin login failed";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const register = async (userData) => {
    setError(null);
    
    try {
      const result = await ApiService.register(userData);
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Registration failed";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login");
  };

  const value = {
    current