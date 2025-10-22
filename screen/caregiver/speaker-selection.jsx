import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { CaregiverContext } from "../../context/caregiverContext";
import { SpeakerContext } from "../../context/speakerContext";

export default function SpeakerSelectionScreen() {
  const { getMySpeakers } = useContext(CaregiverContext);
  const { getSpeakerStats, setCurrentStats } = useContext(SpeakerContext);

  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isHorizontal = width > height;

  const fetchSpeakers = async () => {
    setLoading(true);
    try {
      const res = await getMySpeakers();
      if (res.success) setSpeakers(res.speakers);
    } catch (error) {
      console.error("Error al obtener speakers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (speaker) => {
    setLoading(true);
    try {
      const { success, stats } = await getSpeakerStats(speaker.id);
      if (success) {
        setCurrentStats(stats);
        router.push({
          pathname: "/caregiver/speaker-stats",
          params: { speakerId: speaker.id, username: speaker.username },
        });
      }
    } catch (error) {
      console.error("Error al cargar stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Cargando tus cuentas...</Text>
      </View>
    );

  return (
    <View
      style={[
        styles.container,
        isHorizontal && {
          flexDirection: "row",
          justifyContent: "space-around",
        },
      ]}
    >
      <View style={[styles.card, isHorizontal && { width: "40%" }]}>
        <Text style={styles.title}>Selecciona tu cuenta</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {speakers.map((speaker) => (
            <TouchableOpacity
              key={speaker.id}
              style={styles.speakerButton}
              onPress={() => handleSelect(speaker)}
              activeOpacity={0.8}
            >
              <Text style={styles.speakerText}>{speaker.username}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/create-speaker")}
        >
          <Text style={styles.createButtonText}>Crear nueva cuenta</Text>
        </TouchableOpacity>
      </View>
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4B5563",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 16,
  },
  scrollContent: {
    paddingBottom: 16,
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
    elevation: 2,
  },
  speakerText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  createButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
