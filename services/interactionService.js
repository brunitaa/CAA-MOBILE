import api from "../api/axios";

export const logSuggestedPictograms = async (
  inputText,
  suggestedIds,
  speakerId
) => {
  try {
    await api.post(`/interactions/suggested`, {
      input_text: inputText,
      suggested_ids: suggestedIds,
      speaker_id: speakerId,
    });
  } catch (error) {
    console.error("Error registrando sugerencias:", error);
  }
};

export const logUsedPictograms = async (inputText, usedIds, speakerId) => {
  try {
    await api.post(`/interactions/used`, {
      input_text: inputText,
      used_ids: usedIds,
      speaker_id: `speaker${speakerId}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error registrando pictogramas usados:", error);
  }
};
