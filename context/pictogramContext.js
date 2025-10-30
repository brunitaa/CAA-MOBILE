import { createContext, useContext, useEffect, useState } from "react";
import {
  PictogramService,
  createPictogramRequest,
} from "../services/pictogramService";
import { CaregiverContext } from "./caregiverContext";
import { SelectedSpeakerContext } from "./selectedSpeakerContext";

export const PictogramContext = createContext();

export const PictogramProvider = ({ children }) => {
  const { token } = useContext(CaregiverContext);
  const { selectedSpeaker } = useContext(SelectedSpeakerContext);

  const [pictograms, setPictograms] = useState([]);
  const [archivedPictograms, setArchivedPictograms] = useState([]);
  const [posList, setPosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const BACKEND_URL = "http://172.20.10.3:4000";

  const pictogramService = new PictogramService(token);

  const attachImageUrl = (pictogram) => {
    const primaryPos = pictogram.pictogramPos?.find((p) => p.isPrimary);
    return {
      ...pictogram,
      imageUrl: pictogram.image?.url
        ? `${BACKEND_URL}${pictogram.image.url}`
        : undefined,
      bgColor: primaryPos?.pos?.color || "#E5E7EB",
    };
  };

  const loadPictograms = async () => {
    if (!token || !selectedSpeaker) return;

    try {
      setLoading(true);

      // Pictogramas activos
      const all = await pictogramService.getAllPictogramsRequest(
        selectedSpeaker
      );
      setPictograms(all.map(attachImageUrl));

      // Pictogramas archivados
      const archived = await pictogramService.getArchivedPictogramsRequest(
        selectedSpeaker
      );
      setArchivedPictograms(archived.map(attachImageUrl));
    } catch (err) {
      console.error("Error cargando pictogramas:", err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    if (!token) {
      console.log("[PictogramProvider] No hay token, no se cargan POS");
      return;
    }

    try {
      console.log("[PictogramProvider] Cargando POS...");
      const pos = await pictogramService.getAllPosRequest();
      console.log("[PictogramProvider] POS recibidos:", pos);
      setPosList(pos);
    } catch (err) {
      console.error("Error cargando POS:", err.message || err);
    }
  };

  const createPictogram = async (formData) => {
    try {
      const logData = {};
      formData.forEach((value, key) => {
        if (value instanceof File) {
          logData[key] = value.name;
        } else {
          logData[key] = value;
        }
      });
      console.log("Enviando pictograma al backend:", logData);

      const res = await createPictogramRequest(formData);

      const pictogramWithUrl = attachImageUrl(res.data, BACKEND_URL);
      setPictograms((prev) => [...prev, pictogramWithUrl]);

      return pictogramWithUrl;
    } catch (err) {
      console.error("Error creando pictograma:", err);
      setErrors([err.response?.data?.message || "Error al crear pictograma"]);
      throw err;
    }
  };

  const updatePictogramCaregiver = async (id, data) => {
    try {
      const posIdNumber = Number(data.posId);
      const speakerIdNumber = Number(data.speakerId); // ✅ convertir a número

      if (isNaN(posIdNumber))
        throw new Error("Selecciona una categoría gramatical válida");
      if (isNaN(speakerIdNumber)) throw new Error("ID de speaker inválido");

      const form = new FormData();
      form.append("name", data.name);
      form.append("posId", posIdNumber);
      form.append("speakerId", speakerIdNumber); // ✅ agregamos speakerId

      console.log("FormData enviado:", form);

      if (data.imageFile) {
        form.append("imageFile", {
          uri: data.imageFile.uri,
          type: data.imageFile.type || "image/jpeg",
          name: data.imageFile.name || data.imageFile.uri.split("/").pop(),
        });
      }

      const res = await pictogramService.updatePictogramCaregiverRequest(
        id,
        form
      );

      const updated = attachImageUrl(res);

      setPictograms((prev) => prev.map((p) => (p.id === id ? updated : p)));

      return updated;
    } catch (err) {
      const message = err?.message || "Error al editar pictograma";
      setErrors([message]);
      throw new Error(message);
    }
  };

  const deletePictogram = async (id) => {
    try {
      await pictogramService.deletePictogramRequest(id);
      setPictograms((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      const message = err?.message || "Error al eliminar pictograma";
      setErrors([message]);
      throw new Error(message);
    }
  };

  const restorePictogram = async (id) => {
    try {
      const restored = await pictogramService.restorePictogramRequest(id);
      const serialized = attachImageUrl(restored);
      setArchivedPictograms((prev) => prev.filter((p) => p.id !== id));
      setPictograms((prev) => [serialized, ...prev]);
      return { success: true, pictogram: serialized };
    } catch (err) {
      const message = err?.message || "Error al restaurar pictograma";
      setErrors([message]);
      throw new Error(message);
    }
  };

  useEffect(() => {
    console.log(
      "[PictogramProvider] useEffect token/selectedSpeaker:",
      token,
      selectedSpeaker
    );
    if (token && selectedSpeaker) {
      loadPictograms();
      loadDropdowns();
    }
  }, [token, selectedSpeaker]);

  return (
    <PictogramContext.Provider
      value={{
        pictograms,
        archivedPictograms,
        posList,
        loading,
        errors,
        loadPictograms,
        createPictogram,
        updatePictogramCaregiver,
        deletePictogram,
        restorePictogram,
      }}
    >
      {children}
    </PictogramContext.Provider>
  );
};
