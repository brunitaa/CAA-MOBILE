import * as SecureStore from "expo-secure-store";

const CAREGIVER_TOKEN_KEY = "caregiverToken";
const SPEAKER_TOKEN_KEY = "speakerToken";

// Caregiver
export const saveCaregiverToken = async (token) => {
  try {
    await SecureStore.setItemAsync(CAREGIVER_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error guardando caregiver token:", error);
  }
};

export const getCaregiverToken = async () => {
  try {
    return await SecureStore.getItemAsync(CAREGIVER_TOKEN_KEY);
  } catch (error) {
    console.error("Error obteniendo caregiver token:", error);
    return null;
  }
};

export const removeCaregiverToken = async () => {
  try {
    await SecureStore.deleteItemAsync(CAREGIVER_TOKEN_KEY);
  } catch (error) {
    console.error("Error eliminando caregiver token:", error);
  }
};

// Speaker
export const saveSpeakerToken = async (token) => {
  try {
    await SecureStore.setItemAsync(SPEAKER_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error guardando speaker token:", error);
  }
};

export const getSpeakerToken = async () => {
  try {
    return await SecureStore.getItemAsync(SPEAKER_TOKEN_KEY);
  } catch (error) {
    console.error("Error obteniendo speaker token:", error);
    return null;
  }
};

export const removeSpeakerToken = async () => {
  try {
    await SecureStore.deleteItemAsync(SPEAKER_TOKEN_KEY);
  } catch (error) {
    console.error("Error eliminando speaker token:", error);
  }
};
