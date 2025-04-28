// src/services/authService.js
import axios from "axios";

// For Vite projects
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
// For Create React App, use this instead:
// const API_URL = window.ENV?.REACT_APP_API_URL || "http://localhost:5000/api";

export const authService = {
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },
};

export default authService;
