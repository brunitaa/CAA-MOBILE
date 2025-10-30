import api from "../api/axios";

export const getSpeakersRequest = (caregiverToken) => {
  return api.get("/speaker/my-speakers", {
    headers: { Authorization: `Bearer ${caregiverToken}` },
  });
};
export const getSpeakerStatsRequest = (speakerId, caregiverToken) => {
  return api.get(`/stats/speakers/${speakerId}`, {
    headers: { Authorization: `Bearer ${caregiverToken}` },
  });
};

export const createSpeakerRequest = async (speakerData, caregivertoken) => {
  try {
    const res = await api.post("/speaker/create", speakerData, {
      headers: {
        Authorization: `Bearer ${caregivertoken}`,
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

export const selectSpeakerRequest = async (
  caregiverId,
  speakerId,
  caregiverToken
) => {
  console.log("Payload enviado al backend!:", { caregiverId, speakerId });

  const res = await api.post(
    "/speaker/select",
    { caregiverId: Number(caregiverId), speakerId: Number(speakerId) },
    {
      headers: {
        Authorization: `Bearer ${caregiverToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data;
};
