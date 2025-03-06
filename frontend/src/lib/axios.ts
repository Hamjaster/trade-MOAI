import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ENV === "dev" ?  "http://localhost:8080" : "https://trade-moai-backend.vercel.app/",
});

// Add Authorization header for requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
