import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "",
  withCredentials: true,
  timeout: 5000,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("caregiverToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Error obteniendo token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
