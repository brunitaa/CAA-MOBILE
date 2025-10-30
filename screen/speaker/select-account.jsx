import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CaregiverContext } from "../../context/caregiverContext";
import { SelectedSpeakerLoginContext } from "../../context/selectSpeakerLoginContext";
import { getCaregiverToken } from "../../utils/tokenStorage";

export default function SpeakerLoginSelectionScreen() {
  const router = useRouter();
  const [loadingSpeakers, setLoadingSpeakers] = useState(true);
  const [speakers, setSpeakers] = useState([]);
  const [caregiverId, setCaregiverId] = useState(null);
  const [caregiverToken, setCaregiverToken] = useState(null);

  const { getMySpeakers } = useContext(CaregiverContext);
  const { selectSpeakerLogin, loading, selectedSpeaker } = useContext(
    SelectedSpeakerLoginContext
  );

  useEffect(() => {
    if (selectedSpeaker) {
      router.replace("/speaker-grid");
    }
  }, [selectedSpeaker]);

  const fetchCaregiverData = async () => {
    const token = await getCaregiverToken();
    if (!token) {
      Alert.alert("Error", "No se encontró token del cuidador");
      return null;
    }

    const decoded = jwtDecode(token);
    const id = decoded.userId || decoded.id || decoded.sub;

    setCaregiverId(Number(id));
    setCaregiverToken(token);

    return { id: Number(id), token };
  };

  const fetchSpeakers = async (id, token) => {
    setLoadingSpeakers(true);
    try {
      const res = await getMySpeakers(id, token);
      if (Array.isArray(res)) setSpeakers(res);
      else if (res.speakers) setSpeakers(res.speakers);
    } catch (error) {
      console.error("Error al obtener speakers:", error);
      Alert.alert("Error", "No se pudieron obtener los speakers");
    } finally {
      setLoadingSpeakers(false);
    }
  };

  const handleSelectSpeaker = async (speakerId) => {
    if (!caregiverId || !caregiverToken) {
      const data = await fetchCaregiverData();
      if (!data) return;
    }

    const result = await selectSpeakerLogin(
      caregiverId,
      speakerId,
      caregiverToken
    );

    if (result.success) {
      // Login exitoso: ir al Tablero
      router.replace("/speaker-grid");
    } else {
      Alert.alert("Error", result.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      const data = await fetchCaregiverData();
      if (data?.id && data?.token) {
        await fetchSpeakers(data.id, data.token);
      }
    };
    init();
  }, []);

  if (loadingSpeakers || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando speakers...</Text>
      </View>
    );
  }

  if (!speakers.length) {
    return (
      <View style={styles.container}>
        <Text>No se encontraron speakers asociados a este cuidador.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona un Speaker</Text>
      {speakers.map((sp) => (
        <TouchableOpacity
          key={sp.id}
          style={styles.speakerButton}
          onPress={() => handleSelectSpeaker(sp.id)}
        >
          <Text style={styles.speakerText}>{sp.username}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#EEF2FF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
  },
  loadingText: { marginTop: 12, fontSize: 16, color: "#4B5563" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 16,
  },
  speakerButton: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
    width: "100%",
    maxWidth: 300,
  },
  speakerText: { fontSize: 16, color: "#111827", fontWeight: "500" },
});
