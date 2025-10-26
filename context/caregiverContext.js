import { createContext, useCallback, useEffect, useState } from "react";
import {
  getSpeakersRequest,
  loginCaregiverRequest,
  logoutRequest,
  verifyTokenRequest,
} from "../services/caregiverService";
import { getToken, removeToken, saveToken } from "../utils/secureStorage";

export const CaregiverContext = createContext();

export const CaregiverProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [speakers, setSpeakers] = useState([]);

  const login = async (email, password) => {
    try {
      const res = await loginCaregiverRequest({ email, password });
      const jwt = res.data.token;

      await saveToken(jwt);
      setToken(jwt);
      setUser(res.data.user || null);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      await removeToken();
      setUser(null);
      setToken(null);
      setSpeakers([]);
    }
  };

  const validateToken = useCallback(async () => {
    try {
      const storedToken = await getToken();
      if (!storedToken) throw new Error("No token found");

      const res = await verifyTokenRequest(storedToken);
      if (res.data.valid) {
        setUser(res.data.user);
        setToken(storedToken);
      } else {
        await logout();
      }
    } catch (error) {
      console.log("Token inválido o expirado:", error.message);
      await logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const getMySpeakers = async () => {
    try {
      if (!token) throw new Error("Token no disponible");
      const res = await getSpeakersRequest(token);
      setSpeakers(res.data.speakers || []);
      return { success: true, speakers: res.data.speakers };
    } catch (err) {
      console.error("Error obteniendo speakers:", err.message);
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const ensureTokenValid = async () => {
    if (!token) await validateToken();
  };

  return (
    <CaregiverContext.Provider
      value={{
        user,
        token,
        speakers,
        login,
        logout,
        getMySpeakers,
        loading,
        ensureTokenValid,
      }}
    >
      {children}
    </CaregiverContext.Provider>
  );
};
