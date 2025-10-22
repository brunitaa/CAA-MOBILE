import api from "./axios";

export const getStatsRequest = async () => {
  return api.get("/stats/dashboard");
};
