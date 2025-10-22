import api from "../api/axios";

// Obtener mis speakers
export const getSpeakersRequest = (token) => {
  return api.get("/speaker/my-speakers", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getSpeakerStatsRequest = (speakerId, token) => {
  return api.get(`/stats/speakers/${speakerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createSpeakerRequest = async (speakerData, token) => {
  try {
    const res = await api.post("/speaker/create", speakerData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      "Error creando speaker:",
      error.response?.data || error.message
    );
    throw error;
  }
};
