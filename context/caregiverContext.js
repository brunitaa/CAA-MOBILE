import { createContext, useCallback, useState } from "react";
import {
  getSpeakersRequest,
  loginCaregiverRequest,
  logoutRequest,
  validateTokenRequest,
} from "../services/caregiverService";
import {
  getCaregiverToken,
  removeCaregiverToken,
  saveCaregiverToken,
} from "../utils/secureStorage";

export const CaregiverContext = createContext();

export const CaregiverProvider = ({ children }) => {
  const [userCaregiver, setUserCaregiver] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [speakers, setSpeakers] = useState([]);

  // Login
  const login = async (email, password) => {
    try {
      const res = await loginCaregiverRequest({ email, password });
      const jwt = res.data.token;
      const user = res.data.user;

      await saveCaregiverToken(jwt);
      setToken(jwt);
      setUserCaregiver(user);

      return { success: true, token: jwt, user };
    } catch (err) {
      console.error("Login error:", err);
      return {
        success: false,
        message: err.response?.data?.message || err.message,
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      console.warn("Logout error:", e);
    } finally {
      await removeCaregiverToken();
      setUserCaregiver(null);
      setToken(null);
      setSpeakers([]);
    }
  };

  // Validar sesión
  const validateSession = useCallback(async () => {
    setLoading(true);
    try {
      const storedToken = await getCaregiverToken();
      if (!storedToken) {
        setUserCaregiver(null);
        setToken(null);
        return { valid: false };
      }

      const res = await validateTokenRequest(storedToken);
      if (res.valid) {
        setUserCaregiver(res.user);
        setToken(storedToken);
        return { valid: true, user: res.user, token: storedToken };
      } else {
        await removeCaregiverToken();
        setUserCaregiver(null);
        setToken(null);
        return { valid: false };
      }
    } catch (error) {
      console.error("Error validando sesión:", error);
      await removeCaregiverToken();
      setUserCaregiver(null);
      setToken(null);
      return { valid: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener speakers
  const getMySpeakers = async (useToken = null) => {
    try {
      const currentToken = useToken || token;
      if (!currentToken) throw new Error("Token no disponible");

      const res = await getSpeakersRequest(currentToken);
      setSpeakers(res.data.speakers || []);
      return { success: true, speakers: res.data.speakers };
    } catch (err) {
      console.error("Error obteniendo speakers:", err.message);
      return { success: false, message: err.message };
    }
  };

  // Forzar validación si no hay token
  const ensureTokenValid = async () => {
    if (!token) await validateSession();
  };

  return (
    <CaregiverContext.Provider
      value={{
        userCaregiver,
        token,
        speakers,
        login,
        logout,
        getMySpeakers,
        loading,
        ensureTokenValid,
        validateSession,
      }}
    >
      {children}
    </CaregiverContext.Provider>
  );
};
