import { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SpeakerContext } from "../../context/speakerContext";

const { width } = Dimensions.get("window");

export default function SpeakerDashboardScreen({ route }) {
  const { stats, statsLoading, getSpeakerStats } = useContext(SpeakerContext);
  const [localStats, setLocalStats] = useState(null);
  const speakerId = route?.params?.speakerId;

  useEffect(() => {
    if (speakerId) {
      getSpeakerStats(speakerId).then((res) => {
        if (res?.success) {
          setLocalStats(res.stats); // Guarda los datos en local
        }
      });
    }
  }, [speakerId]);

  // Si el contexto cambia, actualiza también el local
  useEffect(() => {
    if (stats) setLocalStats(stats);
  }, [stats]);

  if (statsLoading || !localStats) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  const s = localStats;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>CAA App</Text>
        <View style={styles.profileButton}>
          <Text style={styles.profileText}>Perfil</Text>
        </View>
      </View>

      {/* Información general */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Información del usuario</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre de usuario:</Text>
          <Text style={styles.infoValue}>{s.username}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Edad:</Text>
          <Text style={styles.infoValue}>{s.age} años</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Género:</Text>
          <Text style={styles.infoValue}>
            {s.gender === "male"
              ? "Masculino"
              : s.gender === "female"
              ? "Femenino"
              : "Otro"}
          </Text>
        </View>
      </View>

      {/* Métricas generales */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumen de uso</Text>

        <StatItem
          label="Tableros creados"
          value={s.gridsCount}
          color="#3B82F6"
        />
        <StatItem
          label="Pictogramas usados"
          value={s.pictogramsCount}
          color="#10B981"
        />
        <StatItem
          label="Sesiones realizadas"
          value={s.sessionsCount}
          color="#F59E0B"
        />
      </View>

      {/* Estadísticas adicionales */}
      {s.statistics && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Estadísticas adicionales</Text>
          {Object.entries(s.statistics).map(([key, value]) => (
            <View key={key} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{key}:</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Imagen o gráfico */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Visualización</Text>
        <View style={styles.imagePlaceholder}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.placeholderImage}
          />
          <Text style={styles.placeholderText}>
            Próximamente: gráficos de progreso
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function StatItem({ label, value, color }) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.statLabel}>{label}:</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { fontSize: 16, color: "#6B7280" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  appName: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  profileButton: {
    backgroundColor: "#9CA3AF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    opacity: 0.7,
  },
  profileText: { color: "white", fontSize: 14 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111827",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: { fontSize: 14, color: "#6B7280" },
  infoValue: { fontSize: 14, color: "#111827", fontWeight: "500" },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statLabel: { fontSize: 14, color: "#6B7280", flex: 1 },
  statValue: { fontSize: 14, color: "#111827", fontWeight: "500" },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  placeholderImage: {
    width: width * 0.5,
    height: width * 0.3,
    resizeMode: "contain",
    marginBottom: 8,
  },
  placeholderText: { color: "#9CA3AF", fontSize: 12 },
});
