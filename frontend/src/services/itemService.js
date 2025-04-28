// src/services/itemService.js
import axios from "axios";
import { authService } from "./authService";

// For Vite projects
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
// For Create React App, use this instead:
// const API_URL = window.ENV?.REACT_APP_API_URL || "http://localhost:5000/api";

// Add interceptor once
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

// Define the service object
export const itemService = {
  async getAllItems(filters = {}) {
    const response = await axios.get(`${API_URL}/items`, { params: filters });
    return response.data;
  },

  async getApprovedItems() {
    const response = await axios.get(`${API_URL}/items/approved`);
    return response.data;
  },

  async getItemById(itemId) {
    const response = await axios.get(`${API_URL}/items/${itemId}`);
    return response.data;
  },

  async getUserItems(userId) {
    const response = await axios.get(`${API_URL}/items/user/${userId}`);
    return response.data;
  },

  async createItem(itemData) {
    const response = await axios.post(`${API_URL}/items`, itemData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async updateItem(itemId, itemData) {
    const response = await axios.put(`${API_URL}/items/${itemId}`, itemData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteItem(itemId) {
    const response = await axios.delete(`${API_URL}/items/${itemId}`);
    return response.data;
  },

  async updateItemStatus(itemId, status) {
    const response = await axios.patch(`${API_URL}/items/${itemId}/status`, {
      status,
    });
    return response.data;
  },

  async approveItem(itemId) {
    const response = await axios.patch(`${API_URL}/items/${itemId}/approve`);
    return response.data;
  },

  async rejectItem(itemId, reason) {
    const response = await axios.patch(`${API_URL}/items/${itemId}/reject`, {
      reason,
    });
    return response.data;
  },

  async searchItems(searchParams) {
    const response = await axios.get(`${API_URL}/items/search`, {
      params: searchParams,
    });
    return response.data;
  },

  async markItemAsSold(itemId) {
    const response = await axios.patch(`${API_URL}/items/${itemId}/sold`);
    return response.data;
  },
};

// Named exports
export const fetchItems = (filters) => itemService.getAllItems(filters);
export const fetchItemById = (itemId) => itemService.getItemById(itemId);
export const deleteItem = (itemId) => itemService.deleteItem(itemId);
export const markItemAsSold = (itemId) => itemService.markItemAsSold(itemId);
export const createItem = (itemData) => itemService.createItem(itemData);
export const updateItem = (itemId, itemData) =>
  itemService.updateItem(itemId, itemData);

// Default export still available if needed
export default itemService;
