import api from "./axios";

// Obtener todos los POS
export const getAllPosRequest = async () => api.get(`/pos`);

// Obtener un POS por ID
export const getPosByIdRequest = async (id) => api.get(`/pos/${id}`);

// Actualizar un POS
export const updatePosRequest = async (id, pos) => api.put(`/pos/${id}`, pos);
