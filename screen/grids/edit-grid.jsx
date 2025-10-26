import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useGrid } from "../../context/gridContext";
import { useSelectedGrid } from "../../context/selectedGridContext";

export default function EditGridScreen() {
  const router = useRouter();
  const { updateGrid, loading } = useGrid();
  const { selectedGrid, clearGrid } = useSelectedGrid();

  const [name, setName] = useState(selectedGrid?.name || "");
  const [description, setDescription] = useState(
    selectedGrid?.description || ""
  );

  if (!selectedGrid) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se ha seleccionado ningún grid.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre del grid no puede estar vacío.");
      return;
    }

    try {
      await updateGrid(selectedGrid.id, { name, description });
      Alert.alert("Éxito", "Grid actualizado correctamente.", [
        {
          text: "OK",
          onPress: () => {
            clearGrid();
            router.back();
          },
        },
      ]);
    } catch {
      Alert.alert("Error", "No se pudo actualizar el grid.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Grid</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del grid"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          clearGrid();
          router.back();
        }}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F2FE", padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  saveButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelButton: {
    backgroundColor: "#94A3B8",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  errorText: { textAlign: "center", color: "#DC2626", fontSize: 16 },
  backButton: {
    marginTop: 20,
    alignSelf: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: { color: "white", fontWeight: "bold" },
});
