import api from "../api/axios";

export const predictPictograms = async (inputText, speakerId) => {
  const response = await api.post(`/predict`, {
    text: inputText,
    speaker_id: speakerId,
  });
  console.log(response.data);
  return response.data;
};
