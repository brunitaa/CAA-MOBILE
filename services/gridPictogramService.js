import api from "@/api/axios";

// Asignar pictogramas a un grid
export const addPictogramsToGridRequest = async (payload) => {
  // payload debe contener: { gridId, pictogramIds, speakerId }
  const response = await api.post(
    `/gridPictogram/assign-pictogram/${payload.gridId}`,
    payload
  );
  return response.data;
};

export const deletePictogramFromGridRequest = async (payload) => {
  return await api.delete("/gridPictogram/delete", {
    data: payload,
  });
};

export const getPictogramsFromGridRequest = async (gridId) => {
  const response = await api.get(`/gridPictogram/${gridId}`);
  return response.data;
};
