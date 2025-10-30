import React, { createContext, useContext, useState } from "react";
import { createSentenceRequest } from "../services/sentencesService";

export const SentenceContext = createContext();

export const SentenceProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [sentences, setSentences] = useState([]);

  const createSentence = async (userId, pictogramIds, telegraphicText) => {
    try {
      setLoading(true);

      const payload = {
        userId,
        pictograms: pictogramIds,
        telegraphicText,
      };

      const res = await createSentenceRequest(payload);
      setSentences((prev) => [...prev, res.data]);
      console.log("Frase registrada en backend:", res.data);
      return res.data;
    } catch (err) {
      console.error("Error al crear la frase:", err.response?.data || err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SentenceContext.Provider value={{ createSentence, sentences, loading }}>
      {children}
    </SentenceContext.Provider>
  );
};

export const useSentence = () => useContext(SentenceContext);
