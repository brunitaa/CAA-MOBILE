import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
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
import { SelectedSpeakerContext } from "../../context/selectedSpeakerContext";

export default function CreateGridScreen() {
  const router = useRouter();
  const { createGrid, loading } = useGrid();
  const { selectedSpeaker } = useContext(SelectedSpeakerContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedSpeaker) {
      Alert.alert("Error", "No se ha seleccionado un usuario speaker.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [selectedSpeaker]);

  const handleCreate = async () => {
    if (!selectedSpeaker || !selectedSpeaker.id) {
      Alert.alert("Error", "No se ha asignado un usuario speaker.");
      return;
    }
    if (!name.trim()) {
      Alert.alert("Error", "Debes ingresar un nombre para el tablero.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Debes ingresar una descripción para el tablero.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        description,
        speakerId: selectedSpeaker.id,
      };

      Alert.alert("Éxito", "Tablero creado correctamente.");
      setName("");
      setDescription("");
      router.push(`/caregiver/grids`);
    } catch (err) {
      console.error("Error creando grid:", err);
      Alert.alert(
        "Error",
        err.response?.data?.message || "No se pudo crear el tablero."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || submitting) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear nuevo Tablero</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del tablero"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descripción del tablero"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Crear Tablero</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2FE",
    padding: 16,
    justifyContent: "center",
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#0F172A",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
