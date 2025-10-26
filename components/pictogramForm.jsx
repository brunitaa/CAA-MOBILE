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
  const { createPictogram, updatePictogram, posList, semanticCategories } =
    useContext(PictogramContext);

  const [formData, setFormData] = useState({
    name: "",
    posId: null,
    semanticCategoryId: null,
    image: null,
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Cargar datos si es edición
  useEffect(() => {
    if (isEdit && pictogram) {
      setFormData({
        name: pictogram.name || "",
        posId: pictogram.pictogramPos?.find((p) => p.isPrimary)?.posId || null,
        semanticCategoryId: pictogram.semanticCategoryId || null,
        image: pictogram.imageUrl ? { uri: pictogram.imageUrl } : null,
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
    if (!formData.semanticCategoryId)
      return Alert.alert("Error", "Selecciona una categoría semántica.");

    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("posId", formData.posId);
      form.append("semanticCategoryId", formData.semanticCategoryId);

      if (formData.image && !formData.image.uri.startsWith("http")) {
        form.append("imageFile", {
          uri: formData.image.uri,
          type: "image/jpeg",
          name: formData.image.uri.split("/").pop(),
        });
      }

      const res = isEdit
        ? await updatePictogram(pictogram.id, form)
        : await createPictogram(form);

      Alert.alert(
        "Éxito",
        `Pictograma ${isEdit ? "actualizado" : "creado"} correctamente.`,
        [{ text: "OK", onPress: onSuccess }]
      );
    } catch (err) {
      console.error("Error al guardar pictograma:", err);
      Alert.alert("Error", "Ocurrió un error al guardar el pictograma.");
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

      {/* Categorías */}
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

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.semanticCategoryId}
          onValueChange={(val) => handleChange("semanticCategoryId", val)}
          style={styles.picker}
        >
          <Picker.Item label="Selecciona categoría semántica" value={null} />
          {semanticCategories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
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
