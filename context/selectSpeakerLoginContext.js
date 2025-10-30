import { createContext, useState } from "react";
import { selectSpeakerRequest } from "../services/SpeakerService";
import { saveSpeakerToken } from "../utils/tokenStorage";

export const SelectedSpeakerLoginContext = createContext();

export const SelectedSpeakerLoginProvider = ({ children }) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [speakerToken, setSpeakerToken] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectSpeakerLogin = async (caregiverId, speakerId, caregiverToken) => {
    setLoading(true);
    try {
      if (!caregiverId || !speakerId || !caregiverToken) {
        throw new Error("Faltan caregiverId, speakerId o caregiverToken");
      }

      console.log("Payload enviado al backend:", { caregiverId, speakerId });

      const res = await selectSpeakerRequest(
        caregiverId,
        speakerId,
        caregiverToken
      );

      const { token, sessionId } = res; // Ojo: según tu respuesta, el token y sessionId vienen directos
      if (!token) throw new Error("No se recibió token del speaker");

      setSelectedSpeaker({ id: speakerId });
      setSpeakerToken(token);
      setSessionId(sessionId);

      await saveSpeakerToken(token);

      return { success: true };
    } catch (error) {
      console.error("Error seleccionando speaker:", error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <SelectedSpeakerLoginContext.Provider
      value={{
        selectedSpeaker,
        speakerToken,
        sessionId,
        selectSpeakerLogin,
        loading,
      }}
    >
      {children}
    </SelectedSpeakerLoginContext.Provider>
  );
};
