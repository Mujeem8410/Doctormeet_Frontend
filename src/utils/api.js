// utils/api.js
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "./runtimeConfig";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isLogoutHandled = false;

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message;
    const status = err.response?.status;

    if (err.code === "ECONNABORTED") {
      err.userMessage = "Server is taking too long to respond. Please try again in a moment.";
      return Promise.reject(err);
    }

    if (!err.response) {
      // Network error or timeout
      console.error("Network Error:", err.message);
      err.userMessage = err.message.includes("timeout")
        ? "Request timeout. Please check your connection."
        : "Unable to reach the server. Please check your internet or try again shortly.";
      return Promise.reject(err);
    }

    // Handle expired token
    if (
      !isLogoutHandled &&
      (message === "Token expired" || message === "Invalid or expired token")
    ) {
      isLogoutHandled = true;
      toast.error("Session expired. Please login again.");
      localStorage.clear();

      setTimeout(() => {
        window.location.href = "/";
        isLogoutHandled = false;
      }, 1500);
      return Promise.reject(err);
    }

    // Set user-friendly message if available
    if (message) {
      err.userMessage = message;
    } else if (status === 404) {
      err.userMessage = "Resource not found";
    } else if (status === 500) {
      err.userMessage = "Server error. Please try again later.";
    }

    return Promise.reject(err);
  }
);

export default API;
