import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PictogramItem from "../../components/pictogram";
import { PictogramContext } from "../../context/pictogramContext";
import { SelectedPictogramContext } from "../../context/selectedPictogramContext";
import { SelectedSpeakerContext } from "../../context/selectedSpeakerContext";

export default function PictogramLibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { pictograms, loading, loadPictograms } = useContext(PictogramContext);
  const { selectedSpeaker } = useContext(SelectedSpeakerContext);
  const { setSelectedPictogram } = useContext(SelectedPictogramContext);

  const { width, height } = useWindowDimensions();
  const [numColumns, setNumColumns] = useState(3);
  const [searchText, setSearchText] = useState("");
  const [filteredPictograms, setFilteredPictograms] = useState([]);

  const HORIZONTAL_PADDING = width * 0.04 * 2;
  const SPACING = 12;
  const ITEM_SIZE =
    (width - HORIZONTAL_PADDING - SPACING * (numColumns - 1)) / numColumns;

  // Ajuste dinámico de columnas según orientación
  useEffect(() => {
    setNumColumns(width > height ? 5 : 3);
  }, [width, height]);

  // Filtrado de pictogramas según búsqueda
  useEffect(() => {
    if (!pictograms) return;
    setFilteredPictograms(
      pictograms.filter((p) =>
        p.name?.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, pictograms]);

  // Cargar pictogramas al entrar y refresco automático
  useFocusEffect(
    useCallback(() => {
      if (selectedSpeaker) loadPictograms(selectedSpeaker);

      const interval = setInterval(() => {
        if (selectedSpeaker) loadPictograms(selectedSpeaker);
      }, 10000);

      return () => clearInterval(interval);
    }, [selectedSpeaker])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Biblioteca de pictogramas</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Buscador fijo */}
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Buscar pictogramas"
          placeholderTextColor="#6B7280"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
      </View>

      {/* Grid de pictogramas */}
      <FlatList
        data={filteredPictograms}
        key={numColumns} // Re-render si cambian columnas
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={{
          paddingHorizontal: width * 0.04,
          paddingBottom: insets.bottom + 120,
          paddingTop: 12,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: SPACING,
        }}
        refreshing={loading}
        onRefresh={() => selectedSpeaker && loadPictograms(selectedSpeaker)}
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
        showsVerticalScrollIndicator={false}
      />

      {/* Botón flotante */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          { bottom: insets.bottom + 20, right: width * 0.06 },
        ]}
        onPress={() => router.push("/create-pictogram")}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2563EB",
  },
  backButton: {
    width: 36,
    height: 36,
    backgroundColor: "#60A5FA",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: { color: "white", fontWeight: "bold", fontSize: 20 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },

  searchWrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    paddingHorizontal: 16,
    color: "#111827",
  },

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
  floatingButtonText: { color: "white", fontSize: 32, fontWeight: "bold" },
});
