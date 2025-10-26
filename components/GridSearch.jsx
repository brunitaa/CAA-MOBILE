import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline"; // Si usas heroicons

export default function GridSearch({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { borderColor: isFocused ? "#2563EB" : "#CBD5E1" },
      ]}
    >
      <MagnifyingGlassIcon
        size={20}
        color={isFocused ? "#2563EB" : "#94a3b8"}
      />
      <TextInput
        placeholder="Buscar grids..."
        value={value}
        onChangeText={onChange}
        style={styles.input}
        placeholderTextColor="#94a3b8"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    marginBottom: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
  },
});
