// utils/api.js
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "./runtimeConfig";

const API = axios.create({
  baseURL: API_BASE_URL,
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

let isLogoutHandled = false; // ✅ flag to prevent multiple toasts

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message;

    if (
      !isLogoutHandled &&
      (message === "Token expired"|| message==="Invalid or expired token" || err.response?.status === 403 || err.response?.status === 401)
    ) {
      isLogoutHandled = true; // ✅ prevent further handling
      toast.error("Session expired. Please login again.");
      localStorage.clear();

      setTimeout(() => {
        window.location.href = "/";
        isLogoutHandled = false; // reset flag on redirect
      }, 1500);
    }

    return Promise.reject(err);
  }
);

export default API;
