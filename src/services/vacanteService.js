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

export const getAllVacantes = async () => {
  try {
    const response = await api.get("/vacante/all");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getVacanteById = async (id) => {
  try {
    const response = await api.get(`/vacante/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createVacante = async (vacanteData) => {
  try {
    const response = await api.post("/vacante/create", vacanteData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateVacante = async (vacanteData) => {
  try {
    const response = await api.put(`/vacante/update`, vacanteData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const expireVacante = async (vacanteData) => {
  try {
    const response = await api.put(`/vacante/expire`, vacanteData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const disableVacante = async (vacanteData) => {
  try {
    const response = await api.delete(`/vacante/disable`, {
      data: vacanteData,
    });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getPostulacionesByVacanteId = async (id) => {
  try {
    const response = await api.get(`/vacante/all/postulacion/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const getCVByPostulacionId = async (idPostulacion) => {
  try {
    const response = await api.get(`/vacante/cv/postulacion/${idPostulacion}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const createPostulacionVisualiza = async (data) => {
  try {
    const response = await api.post("/vacante/postulacionvisualiza", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
