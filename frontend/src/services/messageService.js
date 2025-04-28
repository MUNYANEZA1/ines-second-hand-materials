// src/services/messageService.js
import axios from "axios";
import { authService } from "./authService";

// For Vite projects
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";
// For Create React App, use this instead:
// const API_URL = window.ENV?.REACT_APP_API_URL || "http://localhost:5000/api";

// Ensure interceptor is only added once
if (
  axios.interceptors.request.handlers &&
  axios.interceptors.request.handlers.length === 0
) {
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

// Export both as named export and default export to support both import styles
export const messageService = {
  async getConversations() {
    try {
      const response = await axios.get(`${API_URL}/messages/conversations`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch conversations"
      );
    }
  },

  async getMessagesByConversation(conversationId) {
    try {
      const response = await axios.get(
        `${API_URL}/messages/conversation/${conversationId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  },

  async getMessagesBetweenUsers(userId) {
    try {
      const response = await axios.get(`${API_URL}/messages/user/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  },

  async sendMessage(messageData) {
    try {
      const response = await axios.post(`${API_URL}/messages`, messageData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  },

  async markAsRead(messageId) {
    try {
      const response = await axios.patch(
        `${API_URL}/messages/${messageId}/read`
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to mark message as read"
      );
    }
  },

  async deleteMessage(messageId) {
    try {
      const response = await axios.delete(`${API_URL}/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to delete message"
      );
    }
  },

  async getUnreadCount() {
    try {
      const response = await axios.get(`${API_URL}/messages/unread/count`);
      return response.data.count;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to get unread count"
      );
    }
  },
};

// Also export as default for components that import it that way
export default messageService;