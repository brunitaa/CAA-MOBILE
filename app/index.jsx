import { useRouter } from "expo-router";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Emoji grande y amigable */}
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>👋</Text>
        </View>

        <Text style={styles.title}>¡Hola!</Text>
        <Text style={styles.subtitle}>Bienvenido a tu app de comunicación</Text>

        {/* Botón Speaker - Más grande y colorido */}
        <TouchableOpacity
          style={styles.speakerButton}
          onPress={() => router.push("/account-selection")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonEmoji}>🗣️</Text>
            <View>
              <Text style={styles.buttonTitle}>Quiero Comunicarme</Text>
              <Text style={styles.buttonSubtitle}>Toca aquí para hablar</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Separador visual */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Botón Cuidador */}
        <TouchableOpacity
          style={styles.caregiverButton}
          onPress={() => router.push("/login")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonEmoji}>👨‍👩‍👧‍👦</Text>
            <View>
              <Text style={styles.buttonTitle}>Soy Cuidador</Text>
              <Text style={styles.buttonSubtitle}>Entrar a mi cuenta</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Link de registro más sutil */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/register-caregiver")}
          activeOpacity={0.7}
        >
          <Text style={styles.registerButtonText}>
            ¿Eres nuevo? <Text style={styles.registerLink}>Crear cuenta</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Decoración inferior */}
      <View style={styles.footer}>
        <View style={styles.footerDots}>
          <View style={[styles.dot, { backgroundColor: "#3B82F6" }]} />
          <View style={[styles.dot, { backgroundColor: "#8B5CF6" }]} />
          <View style={[styles.dot, { backgroundColor: "#EC4899" }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2FE",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emojiContainer: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 8,
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 48,
    color: "#475569",
    maxWidth: 280,
  },
  speakerButton: {
    backgroundColor: "#3B82F6",
    width: width - 48,
    maxWidth: 400,
    padding: 20,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  caregiverButton: {
    backgroundColor: "#8B5CF6",
    width: width - 48,
    maxWidth: 400,
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  buttonEmoji: {
    fontSize: 40,
  },
  buttonTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  buttonSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#CBD5E1",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  registerButton: {
    marginTop: 8,
    padding: 12,
  },
  registerButtonText: {
    color: "#64748B",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  registerLink: {
    color: "#3B82F6",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  footer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  footerDots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
