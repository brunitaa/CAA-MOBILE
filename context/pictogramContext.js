import { createContext, useContext, useEffect, useState } from "react";
import { PictogramService } from "../services/pictogramService";
import { CaregiverContext } from "./caregiverContext";

export const PictogramContext = createContext();

export const PictogramProvider = ({ children }) => {
  const { token } = useContext(CaregiverContext);
  const [pictograms, setPictograms] = useState([]);
  const [archivedPictograms, setArchivedPictograms] = useState([]);
  const [posList, setPosList] = useState([]);
  const [semanticCategories, setSemanticCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const pictogramService = new PictogramService(token);
  const BACKEND_URL = "http://10.0.2.2:4000";

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

  const loadPictograms = async (selectedSpeaker) => {
    if (!token) return;

    try {
      setLoading(true);

      // Cargar pictogramas activos
      const all = await pictogramService.getAllPictograms(selectedSpeaker);
      setPictograms(all.map(attachImageUrl));

      // Cargar pictogramas archivados
      const archived = await pictogramService.getArchivedPictograms(
        selectedSpeaker
      );
      setArchivedPictograms(archived.map(attachImageUrl));
    } catch (err) {
      console.error("Error cargando pictogramas:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdowns = async () => {
    if (!token) return;
    try {
      const pos = await pictogramService.getAllPos();
      setPosList(pos);

      const categories = await pictogramService.getAllSemanticCategories();
      setSemanticCategories(categories);
    } catch (err) {
      console.error("Error cargando dropdowns:", err.message);
    }
  };

  const createPictogram = async (formData) => {
    try {
      const pictogram = await pictogramService.createPictogram(formData);
      const serialized = attachImageUrl(pictogram);
      setPictograms((prev) => [serialized, ...prev]);
      return { success: true, pictogram: serialized };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const updatePictogram = async (id, formData) => {
    try {
      const logData = {};
      formData.forEach((value, key) => {
        if (value instanceof File) {
          logData[key] = value.name;
        } else {
          logData[key] = value;
        }
      });

      const res = await pictogramService.updatePictogram(id, formData);

      const updatedWithUrl = attachImageUrl(res);
      setPictograms((prev) =>
        prev.map((p) => (p.id === id ? updatedWithUrl : p))
      );

      return updatedWithUrl;
    } catch (err) {
      console.error("Error updating pictogram:", err);
      // Lanzamos el error para que el componente lo capture
      throw err;
    }
  };

  const deletePictogram = async (id) => {
    try {
      await pictogramService.deletePictogram(id);
      setPictograms((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const restorePictogram = async (id) => {
    try {
      const restored = await pictogramService.restorePictogram(id);
      const serialized = attachImageUrl(restored);
      setArchivedPictograms((prev) => prev.filter((p) => p.id !== id));
      setPictograms((prev) => [serialized, ...prev]);
      return { success: true, pictogram: serialized };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    if (token) {
      loadPictograms();
      loadDropdowns();
    }
  }, [token]);

  return (
    <PictogramContext.Provider
      value={{
        pictograms,
        archivedPictograms,
        posList,
        semanticCategories,
        loading,
        loadPictograms,
        createPictogram,
        updatePictogram,
        deletePictogram,
        restorePictogram,
      }}
    >
      {children}
    </PictogramContext.Provider>
  );
};
