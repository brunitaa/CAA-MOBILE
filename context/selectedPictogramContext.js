import React, { createContext, useState } from "react";

export const SelectedPictogramContext = createContext({
  selectedPictogram: null,
  setSelectedPictogram: () => {},
});

export const SelectedPictogramProvider = ({ children }) => {
  const [selectedPictogram, setSelectedPictogram] = useState(null);

  return (
    <SelectedPictogramContext.Provider
      value={{ selectedPictogram, setSelectedPictogram }}
    >
      {children}
    </SelectedPictogramContext.Provider>
  );
};
