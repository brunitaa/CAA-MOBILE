import { Picker } from "@react-native-picker/picker";
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
import { CaregiverContext } from "../../context/caregiverContext";
import { PictogramContext } from "../../context/pictogramContext";
import { SelectedSpeakerContext } from "../../context/selectedSpeakerContext";

export default function CreatePictogramScreen({ navigation }) {
  const { createPictogram, posList, semanticCategories } =
    useContext(PictogramContext);
  const { user } = useContext(CaregiverContext);
  const { selectedSpeaker } = useContext(SelectedSpeakerContext);
  const { width } = useWindowDimensions();
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPos, setSelectedPos] = useState(null);
  const [selectedSemantic, setSelectedSemantic] = useState(null);

  useEffect(() => {
    if (!selectedSpeaker) {
      Alert.alert("Error", "No se ha seleccionado un usuario speaker.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [selectedSpeaker]);

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
    if (!name.trim()) return Alert.alert("Error", "Debes ingresar un nombre.");
    if (!image)
      return Alert.alert("Error", "Debes seleccionar o tomar una imagen.");
    if (!selectedPos)
      return Alert.alert(
        "Error",
        "Debes seleccionar una categoría gramatical."
      );
    if (!selectedSemantic)
      return Alert.alert("Error", "Debes seleccionar una categoría semántica.");
    if (!selectedSpeaker || !selectedSpeaker.id)
      return Alert.alert("Error", "No se ha asignado un usuario speaker.");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("targetUserId", selectedSpeaker.id);
      formData.append("posId", selectedPos);
      formData.append("semanticCategoryId", selectedSemantic);
      formData.append("imageFile", {
        uri: image.uri,
        type: "image/jpeg",
        name: image.uri.split("/").pop(),
      });

      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await createPictogram(formData);

      console.log("Response from createPictogram:", response);

      if (response.success) {
        Alert.alert("Éxito", "Pictograma creado correctamente.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Error", response.message || "Ocurrió un error.");
      }
    } catch (err) {
      console.error("Error al crear pictograma:", err);
      Alert.alert("Error", "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

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

        {/* POS Picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPos}
            onValueChange={(val) => setSelectedPos(val)}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona categoría gramatical" value={null} />
            {posList.map((pos) => (
              <Picker.Item key={pos.id} label={pos.name} value={pos.id} />
            ))}
          </Picker>
        </View>

        {/* Semantic Picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedSemantic}
            onValueChange={(val) => setSelectedSemantic(val)}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona categoría semántica" value={null} />
            {semanticCategories.map((cat) => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
            ))}
          </Picker>
        </View>

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
  previewContainer: {
    marginBottom: 16,
    alignItems: "center",
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
