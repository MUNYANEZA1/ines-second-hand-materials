// src/services/userService.js
import axios from "axios";
import { authService } from "./authService";

// For Vite projects
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
// For Create React App, use this instead:
// const API_URL = window.ENV?.REACT_APP_API_URL || "http://localhost:5000/api";

// Ensure interceptor is only added once
if (axios.interceptors.request.handlers.length === 0) {
  axios.interceptors.request.use(
    (config) => {
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
}

export const userService = {
  async getAllUsers() {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  },

  async getUserById(userId) {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user details"
      );
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update user profile"
      );
    }
  },

  async changePassword(userId, passwordData) {
    try {
      const response = await axios.patch(
        `${API_URL}/users/${userId}/password`,
        passwordData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to change password"
      );
    }
  },

  async deleteUser(userId) {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
  },

  async updateUserRole(userId, role) {
    try {
      const response = await axios.patch(`${API_URL}/users/${userId}/role`, {
        role,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update user role"
      );
    }
  },
};
