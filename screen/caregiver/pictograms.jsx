import { StyleSheet, Text, View } from "react-native";

export default function CaregiverPictograms() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pictogramas</Text>
      <Text>Aquí podrás ver o gestionar los pictogramas del sistema.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});
