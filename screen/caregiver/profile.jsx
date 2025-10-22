import { useContext } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CaregiverContext } from "../../context/caregiverContext";

export default function CaregiverProfile() {
  const { caregiver, logout } = useContext(CaregiverContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Cuidador</Text>
      <Text>Nombre: {caregiver?.username || "No disponible"}</Text>
      <Text>Email: {caregiver?.email || "No disponible"}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  logoutButton: {
    backgroundColor: "#EF4444",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
});
