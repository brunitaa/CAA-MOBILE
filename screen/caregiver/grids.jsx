import { StyleSheet, Text, View } from "react-native";

export default function CaregiverGrids() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableros</Text>
      <Text>Aquí se mostrarán los tableros creados o asignados.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});
