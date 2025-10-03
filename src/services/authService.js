import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";
import { useAuthStore } from "../stores/authStore";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const handleError = (error) => {
  if (error.response?.data?.message) {
    return {
      isSuccess: false,
      message: error.response.data.message,
      data: null,
    };
  }

  if (error.request) {
    return {
      isSuccess: false,
      message: `No se recibió respuesta del servidor. Endpoint: ${error.config?.url}`,
      data: null,
    };
  }

  return {
    isSuccess: false,
    message: `Error inesperado: ${error.message} en ${
      error.config?.url || "desconocido"
    }`,
    data: null,
  };
};

export const loginUser = async (username, password) => {
  try {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
