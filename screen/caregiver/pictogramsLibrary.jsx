import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import PictogramItem from "../../components/pictogram";
import { PictogramContext } from "../../context/pictogramContext";
import { SelectedPictogramContext } from "../../context/selectedPictogramContext";
import { SelectedSpeakerContext } from "../../context/selectedSpeakerContext";

export default function PictogramLibraryScreen() {
  const router = useRouter();
  const { pictograms, loading, loadPictograms } = useContext(PictogramContext);
  const { selectedSpeaker } = useContext(SelectedSpeakerContext);
  const { setSelectedPictogram } = useContext(SelectedPictogramContext);

  const { width, height } = useWindowDimensions();
  const [numColumns, setNumColumns] = useState(3);
  const [searchText, setSearchText] = useState("");
  const [filteredPictograms, setFilteredPictograms] = useState([]);

  useEffect(() => {
    loadPictograms(selectedSpeaker);
  }, [selectedSpeaker]);

  useEffect(() => {
    setNumColumns(width > height ? 5 : 3);
  }, [width, height]);

  useEffect(() => {
    if (!pictograms) return;
    setFilteredPictograms(
      pictograms.filter((p) =>
        p.name?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, pictograms]);

  const HORIZONTAL_PADDING = width * 0.04 * 2;
  const SPACING = 12;
  const ITEM_SIZE =
    (width - HORIZONTAL_PADDING - SPACING * (numColumns - 1)) / numColumns;

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: width * 0.04 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Biblioteca de pictogramas</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Buscador */}
      <View
        style={[styles.searchContainer, { marginHorizontal: width * 0.04 }]}
      >
        <TextInput
          placeholder="Buscar pictogramas"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Grid de pictogramas */}
      <FlatList
        data={filteredPictograms}
        key={numColumns}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={{
          paddingHorizontal: width * 0.04,
          paddingBottom: 120,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedPictogram(item);
              router.push("/edit-pictogram");
            }}
          >
            <PictogramItem pictogram={item} size={ITEM_SIZE} />
          </TouchableOpacity>
        )}
      />

      {/* Botón flotante */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          { bottom: height * 0.05, right: width * 0.06 },
        ]}
        onPress={() => router.push("/caregiver/create-pictogram")}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F2FE" },
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: { flex: 1, height: 32 },
  floatingButton: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: { color: "white", fontSize: 28, fontWeight: "bold" },
});
