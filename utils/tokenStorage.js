import * as SecureStore from "expo-secure-store";

const CAREGIVER_TOKEN_KEY = "caregiverToken";
const SPEAKER_TOKEN_KEY = "speakerToken";

export const saveCaregiverToken = async (token) => {
  await SecureStore.setItemAsync(CAREGIVER_TOKEN_KEY, token);
};

export const getCaregiverToken = async () => {
  return await SecureStore.getItemAsync(CAREGIVER_TOKEN_KEY);
};

export const removeCaregiverToken = async () => {
  await SecureStore.deleteItemAsync(CAREGIVER_TOKEN_KEY);
};

export const saveSpeakerToken = async (token) => {
  await SecureStore.setItemAsync(SPEAKER_TOKEN_KEY, token);
};

export const getSpeakerToken = async () => {
  return await SecureStore.getItemAsync(SPEAKER_TOKEN_KEY);
};

export const removeSpeakerToken = async () => {
  await SecureStore.deleteItemAsync(SPEAKER_TOKEN_KEY);
};
