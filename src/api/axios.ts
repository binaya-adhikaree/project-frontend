import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token if available, but skip login endpoint
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token && !config.url?.endsWith("/auth/login/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
