import { createContext, useContext, useState } from "react";
import {
  createSpeakerRequest,
  getSpeakerStatsRequest,
} from "../services/SpeakerService";
import { CaregiverContext } from "./caregiverContext";

export const SpeakerContext = createContext();

export const SpeakerProvider = ({ children }) => {
  const { token } = useContext(CaregiverContext);

  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Crear nuevo speaker
  const createSpeaker = async (speakerData) => {
    setLoading(true);
    try {
      const res = await createSpeakerRequest(token, speakerData);
      const newSpeaker = res.data?.speaker;
      if (newSpeaker) {
        setSpeakers((prev) => [...prev, newSpeaker]);
        return { success: true, speaker: newSpeaker };
      }
      return { success: false, message: "No se pudo crear el speaker" };
    } catch (error) {
      console.error("Error creando speaker:", error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas del speaker
  const getSpeakerStats = async (speakerId) => {
    setStatsLoading(true);
    try {
      const res = await getSpeakerStatsRequest(speakerId, token);
      const statsData = res.data;
      setStats(statsData);
      return { success: true, stats: statsData };
    } catch (error) {
      console.error("Error obteniendo estadísticas del speaker:", error);
      return { success: false, stats: null, message: error.message };
    } finally {
      setStatsLoading(false);
    }
  };

  // ✅ Nueva función y estado para compartir estadísticas activas
  const [currentStats, setCurrentStats] = useState(null);

  return (
    <SpeakerContext.Provider
      value={{
        speakers,
        loading,
        createSpeaker,
        stats,
        statsLoading,
        getSpeakerStats,
        currentStats,
        setCurrentStats, // <- ✅ ahora disponible en otros componentes
      }}
    >
      {children}
    </SpeakerContext.Provider>
  );
};
