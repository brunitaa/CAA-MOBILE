import api from "../api/axios";

export const createSentenceRequest = async (payload) => {
  try {
    console.log("Enviando al backend:", payload);
    const response = await api.post(`/sentences/create`, payload);
    return response.data;
  } catch (error) {
    console.error(" Error al crear oración:", error.response?.data || error);
    throw error;
  }
};
