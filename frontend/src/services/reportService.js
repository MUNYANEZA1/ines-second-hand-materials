// src/services/reportService.js
import axios from "axios";
import { authService } from "./authService";

// For Vite projects
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
// For Create React App, use this instead:
// const API_URL = window.ENV?.REACT_APP_API_URL || "http://localhost:5000/api";

// Set up request interceptor for authentication
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

export const reportService = {
  async getAllReports() {
    try {
      const response = await axios.get(`${API_URL}/reports`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch reports"
      );
    }
  },

  async createReport(reportData) {
    try {
      const response = await axios.post(`${API_URL}/reports`, reportData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create report"
      );
    }
  },

  async resolveReport(reportId, resolution) {
    try {
      const response = await axios.put(
        `${API_URL}/reports/${reportId}/resolve`,
        { resolution }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to resolve report"
      );
    }
  },

  async deleteReport(reportId) {
    try {
      const response = await axios.delete(`${API_URL}/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete report"
      );
    }
  },
};
