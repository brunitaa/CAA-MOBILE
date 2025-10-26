import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a CAA App</Text>
      <Text style={styles.subtitle}>
        Selecciona tu rol para comenzar. Si eres un cuidador nuevo, puedes
        registrarte.
      </Text>

      <TouchableOpacity
        style={styles.speakerButton}
        onPress={() => router.push("/login-speaker")}
      >
        <Text style={styles.buttonText}>Soy Speaker</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.caregiverButton}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Soy Cuidador</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => router.push("/register-caregiver")}
      >
        <Text style={styles.registerButtonText}>Registrarse como Cuidador</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 12 },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    maxWidth: 320,
  },
  speakerButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  caregiverButton: {
    backgroundColor: "#16A34A",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  registerButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 16,
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  registerButtonText: {
    color: "#1F2937",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
