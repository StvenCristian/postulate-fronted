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
  if (import.meta.env.DEV) {
    console.error("Error en petición Axios:", error);
  }

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

export const getAllVacantes = async () => {
  try {
    const response = await api.get("postulante/vacante/all");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getVacanteById = async (id) => {
  try {
    const response = await api.get(`postulante/vacante/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const postulacionCreate = async (payload) => {
  try {
    const response = await api.post("/postulante/postulacion", payload);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getPostulacionesByUsuarioId = async (id) => {
  try {
    const response = await api.get(`/postulante/postulacion/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createPostulacionVisualiza = async (data) => {
  try {
    const response = await api.post("/postulante/postulacionvisualiza", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
