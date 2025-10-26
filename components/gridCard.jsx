import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelectedGrid } from "../context/selectedGridContext";

export default function GridCard({
  grid,
  onRestore,
  onArchive,
  showArchived,
  index,
}) {
  const router = useRouter();
  const { selectGrid } = useSelectedGrid();

  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 6,
        tension: 40,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleEdit = () => {
    selectGrid(grid);
    router.push("/edit-grid");
  };

  const handleAssign = () => {
    selectGrid(grid);
    router.push(`/assign-pictogram`);
  };

  return (
    <Animated.View
      style={[styles.card, { transform: [{ scale }, { translateY }], opacity }]}
    >
      {/* Nombre del grid clickeable */}
      <TouchableOpacity
        onPress={handleAssign}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={{ flex: 1 }}
      >
        <Text style={styles.name}>{grid.name}</Text>
      </TouchableOpacity>

      {/* Botones de acción */}
      <View style={styles.actions}>
        {/* Editar */}
        <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
          <Feather name="edit-2" size={20} color="#2563EB" />
        </TouchableOpacity>

        {/* Restaurar */}
        {showArchived && onRestore && (
          <TouchableOpacity
            onPress={() => onRestore(grid.id)}
            style={styles.restoreButton}
          >
            <Text style={styles.restoreText}>Restaurar</Text>
          </TouchableOpacity>
        )}

        {/* Archivar */}
        {!showArchived && onArchive && (
          <TouchableOpacity
            onPress={() => onArchive(grid.id)}
            style={styles.archiveButton}
          >
            <Text style={styles.archiveText}>Archivar</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    justifyContent: "space-between",
  },
  name: { fontSize: 16, fontWeight: "500", color: "#0F172A", marginBottom: 8 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "#E0F2FE",
    padding: 6,
    borderRadius: 8,
    marginRight: 6,
  },
  restoreButton: {
    backgroundColor: "#10B981",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 6,
  },
  restoreText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  archiveButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 6,
  },
  archiveText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
