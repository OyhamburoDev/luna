import axios from "axios";
import { useAuthStore } from "../store/auth";

const axiosInstance = axios.create({
  baseURL: "https://tuservidor.com/api", // Cambiá esto por tu API real
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token automáticamente
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
