import * as Speech from "expo-speech";
import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PictogramItem from "../../components/pictogram";
import { PictogramContext } from "../../context/pictogramContext";
import { SelectedSpeakerContext } from "../../context/selectedSpeakerContext";
import { useSentence } from "../../context/sentenceContext";
import { logSuggestedPictograms } from "../../services/interactionService";
import { predictPictograms } from "../../services/predictionService";

const SpeakerBoardScreen = () => {
  const { selectedSpeaker } = useContext(SelectedSpeakerContext);
  const { pictograms, loadPictograms, loading } = useContext(PictogramContext);
  const { createSentence } = useSentence();

  const [currentPhrase, setCurrentPhrase] = useState([]);
  const [spanishVoice, setSpanishVoice] = useState(null);
  const [suggestedPictograms, setSuggestedPictograms] = useState([]);

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const numColumns = width > height ? 5 : 3;

  const HORIZONTAL_PADDING = width * 0.04 * 2;
  const SPACING = 12;
  const ITEM_SIZE =
    (width - HORIZONTAL_PADDING - SPACING * (numColumns - 1)) / numColumns;

  useEffect(() => {
    const getSpanishVoice = async () => {
      const voices = await Speech.getAvailableVoicesAsync();
      const spanishVoices = voices.filter(
        (v) => v.language.startsWith("es-") || v.language === "es"
      );
      const premiumVoice = spanishVoices.find(
        (v) =>
          v.identifier.toLowerCase().includes("premium") ||
          v.identifier.toLowerCase().includes("enhanced") ||
          v.identifier.toLowerCase().includes("neural") ||
          v.quality === "enhanced"
      );
      setSpanishVoice(premiumVoice?.identifier || spanishVoices[0]?.identifier);
    };
    getSpanishVoice();
  }, []);

  useEffect(() => {
    if (selectedSpeaker?.id) {
      loadPictograms(selectedSpeaker.id);
    }
  }, [selectedSpeaker]);

  const speakInSpanish = (text) => {
    const options = {
      language: "es-ES",
      rate: 0.75,
      pitch: 1.05,
      quality: "enhanced",
    };
    if (spanishVoice) options.voice = spanishVoice;
    Speech.speak(text, options);
  };

  const addPictogramToPhrase = async (pictogram) => {
    const newPhrase = [...currentPhrase, pictogram];
    setCurrentPhrase(newPhrase);

    const text = newPhrase.map((p) => p.name).join(" ");
    speakInSpanish(text);

    try {
      const result = await predictPictograms(text, selectedSpeaker.id);

      if (result?.predictions) {
        setSuggestedPictograms(result.predictions);
        await logSuggestedPictograms(
          text,
          result.predictions,
          selectedSpeaker.id
        );
      }
    } catch (error) {
      console.error("Error en predicción de pictogramas:", error);
    }
  };

  const removePictogram = (index) => {
    const newPhrase = [...currentPhrase];
    newPhrase.splice(index, 1);
    setCurrentPhrase(newPhrase);
  };

  const clearPhrase = () => setCurrentPhrase([]);

  const playPhrase = async () => {
    if (!currentPhrase.length) return;

    const telegraphicText = currentPhrase.map((p) => p.name).join(" ");
    const pictogramIds = currentPhrase.map((p) => p.id);

    speakInSpanish(telegraphicText);
    console.log("HHHHHHHH");
    console.log(pictogramIds);

    try {
      const res = await createSentence(
        selectedSpeaker.id,
        pictogramIds,
        telegraphicText
      );
      console.log("Frase guardada:", res);
    } catch (err) {
      console.error("Error al guardar frase:", err);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Cargando pictogramas...</Text>
      </View>
    );
  }

  const suggestedItems = pictograms.filter((p) =>
    suggestedPictograms.includes(p.id)
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 140 }]}>
      <View style={[styles.header, { paddingHorizontal: width * 0.04 }]}>
        <Text style={styles.title}>Tablero de Pictogramas</Text>
      </View>

      <FlatList
        data={pictograms}
        key={numColumns}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={{
          paddingHorizontal: width * 0.04,
          paddingBottom: 12,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => addPictogramToPhrase(item)}>
            <PictogramItem pictogram={item} size={ITEM_SIZE} />
          </TouchableOpacity>
        )}
      />

      {/* Sugerencias del modelo */}
      {suggestedItems.length > 0 && (
        <View style={{ marginTop: 12, paddingHorizontal: width * 0.04 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
            Sugerencias:
          </Text>
          <FlatList
            data={suggestedItems}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => addPictogramToPhrase(item)}>
                <PictogramItem pictogram={item} size={ITEM_SIZE} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Frase actual */}
      <View
        style={[styles.phraseContainer, { paddingBottom: insets.bottom + 12 }]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.phraseScroll}
        >
          {currentPhrase.map((p, i) => (
            <View key={i} style={styles.phraseItem}>
              <PictogramItem pictogram={p} size={60} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removePictogram(i)}
              >
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {currentPhrase.length > 0 && (
          <View style={styles.phraseActions}>
            <TouchableOpacity style={styles.playPhraseBtn} onPress={playPhrase}>
              <Text style={styles.playPhraseText}>▶ Reproducir y guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearPhrase}>
              <Text style={styles.clearText}>🗑 Borrar frase</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F2FE" },
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
  },
  phraseContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  phraseScroll: { alignItems: "center", paddingHorizontal: 12 },
  phraseItem: { marginRight: 8, position: "relative" },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF4D4F",
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  removeText: { color: "#FFF", fontSize: 12 },
  phraseActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 12,
  },
  playPhraseBtn: {
    flex: 1,
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 6,
  },
  playPhraseText: { color: "#FFF", fontWeight: "bold" },
  clearButton: {
    flex: 1,
    backgroundColor: "#FF4D4F",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 6,
  },
  clearText: { color: "#FFF", fontWeight: "bold" },
});

export default SpeakerBoardScreen;
