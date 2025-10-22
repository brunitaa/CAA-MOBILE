import api from "./axios";

// Crear un pictograma
export const createPictogramRequest = async (formData) => {
  console.log("API: enviando pictograma...");
  console.log(formData);
  return api.post("/pictograms/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Actualizar un pictograma
export const updatePictogramRequest = async (id, formData) =>
  api.put(`/pictograms/edit/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Eliminar un pictograma
export const deletePictogramRequest = async (id) =>
  api.delete(`/pictograms/delete/${id}`);
export const restorePictogramRequest = async (id) =>
  api.patch(`/pictograms/restore/${id}`);
// Obtener todos los pictogramas
export const getAllPictogramsRequest = async () => api.get("/pictograms");
export const getArchivedPictogramsRequest = async () =>
  api.get("/pictograms/archived");

// Obtener un pictograma por ID
export const getPictogramRequest = async (id) => api.get(`/pictograms/${id}`);
