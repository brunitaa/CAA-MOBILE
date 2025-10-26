// context/selectedSpeakerContext.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";

export const SelectedSpeakerContext = createContext();

export const SelectedSpeakerProvider = ({ children }) => {
  const [selectedSpeaker, setSelectedSpeakerState] = useState(null);

  const setSelectedSpeaker = async (speaker) => {
    setSelectedSpeakerState(speaker);
    await AsyncStorage.setItem("selectedSpeaker", JSON.stringify(speaker));
  };

  useEffect(() => {
    const loadSpeaker = async () => {
      const stored = await AsyncStorage.getItem("selectedSpeaker");
      if (stored) setSelectedSpeakerState(JSON.parse(stored));
    };
    loadSpeaker();
  }, []);

  return (
    <SelectedSpeakerContext.Provider
      value={{ selectedSpeaker, setSelectedSpeaker }}
    >
      {children}
    </SelectedSpeakerContext.Provider>
  );
};
