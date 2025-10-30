import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { PictogramContext } from "../../context/pictogramContext";
import { SelectedSpeakerContext } from "../../context/selectedSpeakerContext";

export default function CreatePictogramScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const {
    createPictogram,
    posList,
    loadDropdowns,
    loading: contextLoading,
  } = useContext(PictogramContext);
  const { selectedSpeaker } = useContext(SelectedSpeakerContext);

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedPos, setSelectedPos] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!selectedSpeaker) {
      Alert.alert("Error", "No se ha seleccionado un usuario speaker.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [selectedSpeaker]);

  useEffect(() => {
    if (posList.length === 0) {
      loadDropdowns();
    } else {
      setItems(
        posList.map((pos) => ({
          label: pos.name,
          value: pos.id.toString(),
        }))
      );
    }
  }, [posList]);

  // Seleccionar imagen
  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se requiere acceso a tus fotos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se requiere acceso a la cámara.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !image || !selectedPos || !selectedSpeaker?.id) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("speakerId", selectedSpeaker.id.toString());
      formData.append("posId", selectedPos.toString());
      formData.append("imageFile", {
        uri: image.uri,
        name: image.uri.split("/").pop(),
        type: image.uri.endsWith(".png") ? "image/png" : "image/jpeg",
      });

      console.log("FormData listo para enviar:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await createPictogram(formData);

      Alert.alert("Éxito", "Pictograma creado correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error("Error al crear pictograma:", err);
      Alert.alert("Error", err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 8 }}>Cargando categorías...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: width * 0.04 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Crear Pictograma</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Formulario */}
      <View style={[styles.formContainer, { paddingHorizontal: width * 0.04 }]}>
        <TextInput
          placeholder="Nombre del pictograma"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        {/* Imagen */}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={pickImageFromGallery}
          >
            {image ? (
              <Image
                source={{ uri: image.uri }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.imagePickerText}>Seleccionar imagen</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.imagePicker} onPress={takePhoto}>
            <Text style={styles.imagePickerText}>Tomar foto</Text>
          </TouchableOpacity>
        </View>

        {image && (
          <View style={styles.previewContainer}>
            <Text style={{ marginBottom: 4 }}>Previsualización:</Text>
            <Image
              source={{ uri: image.uri }}
              style={{ width: 100, height: 100, borderRadius: 8 }}
            />
          </View>
        )}

        {/* POS Dropdown */}
        <DropDownPicker
          open={openDropdown}
          value={selectedPos}
          items={items}
          setOpen={setOpenDropdown}
          setValue={setSelectedPos}
          setItems={setItems}
          placeholder="Selecciona categoría gramatical"
          containerStyle={{ marginBottom: 16 }}
          style={{ backgroundColor: "white", borderColor: "#CBD5E1" }}
          dropDownContainerStyle={{
            backgroundColor: "white",
            borderColor: "#CBD5E1",
          }}
          zIndex={1000}
        />

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Crear Pictograma</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F2FE" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
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
  formContainer: { flex: 1, justifyContent: "flex-start" },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imagePicker: {
    backgroundColor: "#fff",
    height: 140,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    flex: 1,
    marginRight: 8,
  },
  imagePickerText: { color: "#94A3B8", textAlign: "center" },
  imagePreview: { width: "100%", height: "100%", borderRadius: 12 },
  previewContainer: { marginBottom: 16, alignItems: "center" },
  submitButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
