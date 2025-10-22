import api from "./axios";

export const createGridRequest = async (formData) => {
  return api.post("/grids/create", formData);
};
export const updateGridRequest = async (id, formData) =>
  api.put(`/grids/edit/${id}`, formData);

export const deleteGridRequest = async (id) =>
  api.delete(`/grids/delete/${id}`);
export const getAllGridsRequest = async (id) => api.get(`/grids`);

export const getGridByIdRequest = async (id) => api.get(`/grids/${id}`);

export const getArchivedGridsRequest = async (id) =>
  api.get(`/grids/archived/all`);

export const restoreGridRequest = async (id) =>
  api.patch(`/grids/restore/${id}`);
