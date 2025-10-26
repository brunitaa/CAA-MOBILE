import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PictogramForm from "../../components/pictogramForm";
import { SelectedPictogramContext } from "../../context/selectedPictogramContext";

export default function EditPictogramScreen() {
  const router = useRouter();
  const { selectedPictogram } = useContext(SelectedPictogramContext);

  useEffect(() => {
    if (!selectedPictogram) {
      Alert.alert("Error", "No hay pictograma seleccionado.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [selectedPictogram]);

  if (!selectedPictogram) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar Pictograma</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Formulario */}
      <PictogramForm
        pictogram={selectedPictogram}
        isEdit={true}
        onSuccess={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F2FE" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    backgroundColor: "#60A5FA",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: { color: "white", fontWeight: "bold", fontSize: 18 },
  title: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
});
