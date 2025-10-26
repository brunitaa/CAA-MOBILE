import { useRouter } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import PictogramItem from "../../components/pictogram";
import { useGridPictogram } from "../../context/gridPictogramContext";
import { PictogramContext } from "../../context/pictogramContext";
import { useSelectedGrid } from "../../context/selectedGridContext";
import { SelectedSpeakerContext } from "../../context/selectedSpeakerContext";

export default function AssignPictogramsMobile() {
  const router = useRouter();
  const { selectedSpeaker } = useContext(SelectedSpeakerContext);
  const { selectedGrid } = useSelectedGrid();
  const {
    pictograms: allGridPictograms,
    pictogramsGlobales,
    fetchPictogramsByGrid,
    addPictograms,
    removePictograms,
    clearPictograms,
    loading,
  } = useGridPictogram();
  const { pictograms: allPictograms, loadPictograms } =
    useContext(PictogramContext);

  const { width, height } = useWindowDimensions();
  const [numColumns, setNumColumns] = useState(3);
  const [selected, setSelected] = useState([]);
  const [showAvailable, setShowAvailable] = useState(false);

  // Cargar pictogramas al cambiar de grid
  useEffect(() => {
    if (!selectedGrid) {
      router.back();
      return;
    }

    const loadData = async () => {
      try {
        setSelected([]);
        clearPictograms();

        await fetchPictogramsByGrid(selectedGrid.id);

        await loadPictograms(selectedSpeaker);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [selectedGrid]);

  useEffect(() => {
    setNumColumns(width > height ? 5 : 3);
  }, [width, height]);

  const ITEM_SIZE = (width - 32 - (numColumns - 1) * 12) / numColumns;
  const assignedIds = allGridPictograms?.map((p) => p.id) || [];
  console.log("===== Pictogramas del tablero (assigned) =====", assignedIds);

  const availablePictograms = useMemo(() => {
    const combined = [...(pictogramsGlobales || []), ...(allPictograms || [])];
    const filtered = combined.filter((p) => !assignedIds.includes(p.id));
    console.log("===== Pictogramas disponibles para agregar =====", filtered);
    return filtered;
  }, [allPictograms, pictogramsGlobales, assignedIds]);

  const toggleSelect = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const handleAddPictograms = async () => {
    if (!selected.length) return;
    try {
      await addPictograms(
        selectedGrid.id,
        selected,
        "caregiver",
        selectedGrid.speakerId
      );
      setShowAvailable(false);
      setSelected([]); // limpiar selección
    } catch (err) {
      console.error("Error al agregar pictogramas:", err);
      alert("Error al agregar pictogramas");
    }
  };

  const handleRemovePictogram = async (id) => {
    try {
      await removePictograms(selectedGrid.id, [id]);
      setSelected((prev) => prev.filter((pid) => pid !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar pictograma");
    }
  };

  if (!selectedGrid || loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selectedGrid.name}</Text>
        <View style={{ width: 32 }} />
      </View>

      <Text style={styles.sectionTitle}>Pictogramas en el tablero</Text>
      {assignedIds.length === 0 ? (
        <Text style={{ color: "#6B7280", marginBottom: 8 }}>
          No hay pictogramas en el tablero
        </Text>
      ) : (
        <FlatList
          data={allGridPictograms}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 12,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleRemovePictogram(item.id)}>
              <PictogramItem pictogram={item} size={ITEM_SIZE} selected />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAvailable((prev) => !prev)}
      >
        <Text style={styles.addButtonText}>
          {showAvailable ? "Cancelar" : "Agregar pictogramas"}
        </Text>
      </TouchableOpacity>

      {showAvailable && (
        <>
          {availablePictograms.length === 0 ? (
            <Text style={{ color: "#6B7280", marginBottom: 8 }}>
              No hay pictogramas disponibles
            </Text>
          ) : (
            <FlatList
              data={availablePictograms}
              keyExtractor={(item) => item.id.toString()}
              numColumns={numColumns}
              columnWrapperStyle={{
                justifyContent: "space-between",
                marginBottom: 12,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => toggleSelect(item.id)}>
                  <PictogramItem
                    pictogram={item}
                    size={ITEM_SIZE}
                    selected={selected.includes(item.id)}
                    style={{
                      borderColor: "#34D399",
                      borderWidth: selected.includes(item.id) ? 2 : 0,
                    }}
                  />
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          )}

          <TouchableOpacity
            onPress={handleAddPictograms}
            style={[styles.saveButton, { marginTop: 12 }]}
            disabled={selected.length === 0}
          >
            <Text style={styles.saveText}>Aceptar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F2FE", paddingHorizontal: 16 },
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    backgroundColor: "#60A5FA",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { color: "white", fontWeight: "bold", fontSize: 18 },
  title: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 8 },
  addButton: {
    marginVertical: 8,
    padding: 12,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  saveButton: {
    backgroundColor: "#34D399",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
