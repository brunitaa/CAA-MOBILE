import React, { createContext, useContext, useState } from "react";
import {
  createGridRequest,
  deleteGridRequest,
  getAllGrids,
  getArchivedGridsRequest,
  restoreGridRequest,
  updateGridRequest,
} from "../services/gridService";
import { CaregiverContext } from "./caregiverContext";

const GridContext = createContext();

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error("useGrid must be used within a GridProvider");
  }
  return context;
};

export const GridProvider = ({ children }) => {
  const [grids, setGrids] = useState([]);
  const [archivedGrids, setArchivedGrids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { token } = useContext(CaregiverContext);

  const loadGrids = async (selectedSpeaker) => {
    if (!token) return;

    try {
      setLoading(true);
      setErrors([]);

      const all = await getAllGrids(selectedSpeaker);
      setGrids(Array.isArray(all) ? all : []);

      const archived = await getArchivedGridsRequest(selectedSpeaker);
      const archivedList = archived?.data ?? [];
      console.log("Grids archivados cargados:", archivedList.length);

      setArchivedGrids(Array.isArray(archivedList) ? archivedList : []);
    } catch (err) {
      console.error("Error cargando grids:", err.message, err.response?.data);
      setErrors([err.response?.data?.message || "Error al cargar grids"]);
      setGrids([]);
      setArchivedGrids([]);
    } finally {
      setLoading(false);
    }
  };

  const createGrid = async (formData) => {
    try {
      const res = await createGridRequest(formData);
      setGrids((prev) => [...prev, res.data]);
      return res.data;
    } catch (err) {
      console.error("Error creando grid:", err);
      setErrors([err.response?.data?.message || "Error al crear grid"]);
      throw err;
    }
  };

  const updateGrid = async (id, formData) => {
    try {
      console.log("Actualizando grid:", id, formData);
      const res = await updateGridRequest(id, formData);
      console.log("Grid actualizado:", res.data);
      setGrids((prev) => prev.map((g) => (g.id === id ? res.data : g)));
      return res.data;
    } catch (err) {
      console.error("Error actualizando grid:", err);
      setErrors([err.response?.data?.message || "Error al actualizar grid"]);
      throw err;
    }
  };

  const archiveGrid = async (id) => {
    try {
      console.log("Archivando grid:", id);
      await deleteGridRequest(id);
      const gridToArchive = grids.find((g) => g.id === id);
      if (gridToArchive) {
        setGrids((prev) => prev.filter((g) => g.id !== id));
        setArchivedGrids((prev) => [
          ...prev,
          { ...gridToArchive, isActive: false },
        ]);
      }
    } catch (err) {
      console.error("Error archivando grid:", err);
      throw err;
    }
  };

  const restoreGrid = async (id) => {
    try {
      console.log("Restaurando grid:", id);
      const res = await restoreGridRequest(id);
      const restoredGrid = res.data;
      console.log("Grid restaurado:", restoredGrid);

      setGrids((prev) => {
        const exists = prev.find((g) => g.id === restoredGrid.id);
        return exists
          ? prev.map((g) => (g.id === restoredGrid.id ? restoredGrid : g))
          : [...prev, restoredGrid];
      });

      setArchivedGrids((prev) => prev.filter((g) => g.id !== restoredGrid.id));
    } catch (err) {
      console.error("Error restaurando grid:", err);
      throw err;
    }
  };

  return (
    <GridContext.Provider
      value={{
        grids,
        archivedGrids,
        loading,
        errors,
        loadGrids,
        createGrid,
        updateGrid,
        archiveGrid,
        restoreGrid,
      }}
    >
      {children}
    </GridContext.Provider>
  );
};
