import api from "@/api/axios";

export const createGridRequest = async (formData) => {
  console.log(formData);
  return api.post("/grids/create", formData);
};

export const updateGridRequest = async (id, formData) =>
  api.put(`/grids/edit/${id}`, formData);

export const deleteGridRequest = async (id) =>
  api.delete(`/grids/delete/${id}`);

export const getAllGrids = async (selectedSpeaker) => {
  try {
    const params = selectedSpeaker ? { speakerId: selectedSpeaker.id } : {};

    console.log("Llamando a /grids con params:", params);

    const { data } = await api.get("/grids", { params });
    return data;
  } catch (error) {
    console.error("Error en getAllGrids:", error);
    throw error;
  }
};

export const getGridByIdRequest = async (id) => api.get(`/grids/${id}`);

export const getArchivedGridsRequest = async (selectedSpeaker) => {
  try {
    const params = selectedSpeaker ? { speakerId: selectedSpeaker.id } : {};

    console.log("Llamando a /grids con params:", params);

    const { data } = await api.get("/grids/archived/all", { params });
    return data;
  } catch (error) {
    console.error("Error en getAllGridsArchived:", error);
    throw error;
  }
};

export const restoreGridRequest = async (id) =>
  api.patch(`/grids/restore/${id}`);
