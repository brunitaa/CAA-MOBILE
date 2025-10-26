import { usePathname, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GridCard from "../../components/gridCard";
import { useGrid } from "../../context/gridContext";
import { useSelectedGrid } from "../../context/selectedGridContext";
import { SelectedSpeakerContext } from "../../context/selectedSpeakerContext";

export default function GridLibraryScreen() {
  const router = useRouter();
  const { selectedSpeaker } = useContext(SelectedSpeakerContext);
  const { grids, archivedGrids, loadGrids, restoreGrid, archiveGrid, loading } =
    useGrid();
  const { selectGrid } = useSelectedGrid();
  const pathname = usePathname();

  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (selectedSpeaker) {
      loadGrids(selectedSpeaker);
    }
  }, [selectedSpeaker]);

  useEffect(() => {
    console.log("Ruta actual:", pathname);
  }, [pathname]);

  const handleRestore = (id) => {
    Alert.alert("Restaurar Grid", "¿Deseas restaurar este grid?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Restaurar",
        onPress: async () => {
          try {
            await restoreGrid(id);
            Alert.alert("Éxito", "Grid restaurado correctamente.");
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo restaurar el grid.");
          }
        },
      },
    ]);
  };

  const handleArchive = (id) => {
    Alert.alert("Archivar Grid", "¿Deseas archivar este grid?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Archivar",
        onPress: async () => {
          try {
            await archiveGrid(id);
            Alert.alert("Éxito", "Grid archivado correctamente.");
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "No se pudo archivar el grid.");
          }
        },
      },
    ]);
  };

  // Filtrado por buscador
  const gridsToShow = (showArchived ? archivedGrids : grids).filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Buscador y toggle */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {showArchived ? "Grids Archivados" : "Biblioteca de Grids"}
        </Text>

        <TextInput
          placeholder="Buscar grids..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        <TouchableOpacity onPress={() => setShowArchived(!showArchived)}>
          <Text style={styles.toggleButton}>
            {showArchived ? "Ver Activos" : "Ver Archivados"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lista de grids */}
      <FlatList
        data={gridsToShow}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item, index }) => (
          <GridCard
            grid={item}
            index={index}
            onRestore={showArchived ? handleRestore : null}
            onArchive={!showArchived ? handleArchive : null}
            showArchived={showArchived}
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay grids disponibles</Text>
        }
      />

      {/* Botón flotante */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/create-grid")}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F2FE", padding: 16 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
  },
  toggleButton: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
    marginTop: 8,
  },
  searchInput: {
    height: 44,
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#64748B",
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 6,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
});
