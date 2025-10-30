import { SelectedSpeakerContext } from "@/context/selectedSpeakerContext";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PictogramContext } from "../context/pictogramContext";

export default function PictogramForm({
  pictogram = null,
  isEdit = false,
  onSuccess,
}) {
  const { createPictogram, updatePictogramCaregiver, posList } =
    useContext(PictogramContext);
  const { selectedSpeaker } = useContext(SelectedSpeakerContext);
  console.log(selectedSpeaker);
  const currentSpeakerId = selectedSpeaker?.id;
  console.log(currentSpeakerId);

  const [formData, setFormData] = useState({
    name: "",
    posId: null,
    image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && pictogram) {
      setFormData({
        name: pictogram.name || "",
        posId: pictogram.pictogramPos?.find((p) => p.isPrimary)?.posId || null,
        image: pictogram.imageUrl ? { uri: pictogram.imageUrl } : null,
        speakerId: currentSpeakerId,
      });
    }
  }, [isEdit, pictogram]);

  const handleChange = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Permiso denegado", "Se requiere acceso a tus fotos.");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled)
      setFormData((prev) => ({ ...prev, image: result.assets[0] }));
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted")
      return Alert.alert("Permiso denegado", "Se requiere acceso a la cámara.");

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled)
      setFormData((prev) => ({ ...prev, image: result.assets[0] }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim())
      return Alert.alert("Error", "El nombre del pictograma es obligatorio.");
    if (!formData.posId)
      return Alert.alert("Error", "Selecciona una categoría gramatical.");

    setLoading(true);
    try {
      // Incluimos speakerId siempre
      const data = {
        name: formData.name,
        posId: formData.posId,
        speakerId: currentSpeakerId, // ✅ agregar speakerId
      };

      // Agregar imagen solo si es nueva
      if (formData.image && !formData.image.uri.startsWith("http")) {
        data.imageFile = formData.image;
      }

      // 🔹 Mostrar en consola lo que se enviará
      console.log("Datos a enviar al backend:", data);
      if (isEdit) console.log("ID del pictograma a editar:", pictogram.id);

      const res = isEdit
        ? await updatePictogramCaregiver(pictogram.id, data)
        : await createPictogram(data);

      Alert.alert(
        "Éxito",
        `Pictograma ${isEdit ? "actualizado" : "creado"} correctamente.`,
        [{ text: "OK", onPress: onSuccess }]
      );
    } catch (err) {
      console.error("Error al guardar pictograma:", err);
      Alert.alert("Error", err.message || "Error al guardar pictograma");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <TextInput
        placeholder="Nombre del pictograma"
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      {/* Imagen */}
      <View style={styles.imageSection}>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={pickImageFromGallery}
        >
          <Text style={styles.imageButtonText}>Elegir imagen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Text style={styles.imageButtonText}>Tomar foto</Text>
        </TouchableOpacity>
      </View>

      {formData.image && (
        <View style={styles.previewContainer}>
          <Text style={{ marginBottom: 6 }}>Previsualización:</Text>
          <Image
            source={{ uri: formData.image.uri }}
            style={styles.imagePreview}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Categoría gramatical */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.posId}
          onValueChange={(val) => handleChange("posId", val)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona categoría gramatical" value={null} />
          {posList.map((pos) => (
            <Picker.Item key={pos.id} label={pos.name} value={pos.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.submitButtonText}>
            {isEdit ? "Actualizar Pictograma" : "Crear Pictograma"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F2FE", padding: 16 },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  imageSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginHorizontal: 4,
  },
  imageButtonText: { color: "#2563EB", fontWeight: "500" },
  previewContainer: { alignItems: "center", marginBottom: 20 },
  imagePreview: {
    width: 140,
    height: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    marginBottom: 16,
  },
  picker: { height: 50 },
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
