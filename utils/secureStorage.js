// src/utils/secureStorage.js
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "caregiverToken";

// Guardar el token JWT
export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    console.log("Token guardado correctamente ");
    console.log(token);
  } catch (error) {
    console.error("Error al guardar el token:", error);
  }
};

// Obtener el token JWT
export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error("Error al obtener el token:", error);
    return null;
  }
};

// Eliminar el token JWT
export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    console.log("Token eliminado correctamente ");
  } catch (error) {
    console.error("Error al eliminar el token:", error);
  }
};
