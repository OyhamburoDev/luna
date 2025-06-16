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

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => response, // respuestas exitosas
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Error desconocido";

    // Logueo automático si hay 401
    if (status === 401) {
      useAuthStore.getState().logout(); // si tenés una acción `logout`
    }

    // Mostrar mensaje si tenés alertas integradas
    if (__DEV__) console.error("Error de API:", message);
    // showAlert("error", message); // si usás Notistack, Toast, etc.

    return Promise.reject(error); // siempre devolvé el error
  }
);


export default axiosInstance;
