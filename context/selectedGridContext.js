import { createContext, useContext, useState } from "react";

const SelectedGridContext = createContext();

export const useSelectedGrid = () => {
  const context = useContext(SelectedGridContext);
  if (!context) {
    throw new Error("useSelectedGrid must be used within SelectedGridProvider");
  }
  return context;
};

export const SelectedGridProvider = ({ children }) => {
  const [selectedGrid, setSelectedGrid] = useState(null);

  const selectGrid = (grid) => setSelectedGrid(grid);
  const clearGrid = () => setSelectedGrid(null);

  return (
    <SelectedGridContext.Provider
      value={{ selectedGrid, selectGrid, clearGrid }}
    >
      {children}
    </SelectedGridContext.Provider>
  );
};
