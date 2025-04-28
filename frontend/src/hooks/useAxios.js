// src/hooks/useAxios.js
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useNotification } from "./useNotification";

export const useAxios = () => {
  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Add auth token if user is authenticated
      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };

      if (isAuthenticated) {
        const token = localStorage.getItem("token");
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      addNotification(err.message, "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchData, loading, error, data };
};
