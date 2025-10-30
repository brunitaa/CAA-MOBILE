import { createContext, useContext, useState } from "react";
import {
  addPictogramsToGridRequest,
  deletePictogramFromGridRequest,
  getPictogramsFromGridRequest,
} from "../services/gridPictogramService";

const GridPictogramContext = createContext();
export const useGridPictogram = () => useContext(GridPictogramContext);

export const GridPictogramProvider = ({ children }) => {
  const [pictograms, setPictograms] = useState([]);
  const [gridName, setGridName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const BACKEND_URL = "http://172.20.10.3:4000";

  const fetchPictogramsByGrid = async (gridId) => {
    setLoading(true);
    try {
      const response = await getPictogramsFromGridRequest(Number(gridId));
      const data = response?.data || response || [];

      const normalized = data.map((gp) => {
        const picto = gp.pictogram;
        const primaryPos = gp.pictogramPos?.find((p) => p.isPrimary);

        return {
          id: picto?.id,
          name: picto?.name,
          userId: picto?.userId || null,
          position: gp.position,
          color: primaryPos?.pos?.color || "#ccc",
          partOfSpeech: primaryPos?.pos?.name || "Desconocido",
          imageUrl: picto?.image?.fullUrl
            ? `${BACKEND_URL}${picto.image.fullUrl}`
            : "/placeholder.png",
          pictogramPos: gp.pictogramPos || [],
        };
      });

      setPictograms(normalized);
    } catch (err) {
      const message = err?.message || "Error al conseguir pictogramas";
      setErrors([message]);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const clearPictograms = () => {
    setPictograms([]);
  };

  const addPictograms = async (
    gridId,
    pictogramIds,
    role = "caregiver",
    speakerId
  ) => {
    if (!Array.isArray(pictogramIds)) pictogramIds = [pictogramIds];

    try {
      if (role === "caregiver") {
        await addPictogramsToGridRequest({ gridId, speakerId, pictogramIds });
      }

      await fetchPictogramsByGrid(gridId);
    } catch (err) {
      const message = err?.message || "Error al agregando pictograma";
      setErrors([message]);
      throw new Error(message);
    }
  };

  const removePictograms = async (gridId, pictogramIds) => {
    if (!Array.isArray(pictogramIds)) pictogramIds = [pictogramIds];

    try {
      const deletePromises = pictogramIds.map((pictogramId) =>
        deletePictogramFromGridRequest({ gridId: Number(gridId), pictogramId })
      );

      await Promise.all(deletePromises);
      await fetchPictogramsByGrid(gridId);
    } catch (err) {
      const message =
        err?.message || "Error al eliminando pictograma del tablero";
      setErrors([message]);
      throw new Error(message);
    }
  };

  const pictogramsGlobales = pictograms.filter((p) => p.userId === null);

  return (
    <GridPictogramContext.Provider
      value={{
        pictograms,
        gridName,
        loading,
        fetchPictogramsByGrid,
        pictogramsGlobales,
        addPictograms,
        removePictograms,
        clearPictograms,
      }}
    >
      {children}
    </GridPictogramContext.Provider>
  );
};
