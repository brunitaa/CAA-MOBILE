// requests/semantic.request.js
import api from "./axios";

export const getSemanticByPosRequest = async (posId) => {
  return api.get(`/semantic/${posId}`);
};
