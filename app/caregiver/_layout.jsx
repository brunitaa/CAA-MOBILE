import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Dimensions, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CaregiverLayout() {
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get("window");

  // Ajuste dinámico del tamaño de iconos y etiquetas
  const isAndroid = Platform.OS === "android";
  const iconSize = isAndroid ? (screenHeight > 700 ? 28 : 24) : 24;
  const labelFontSize = isAndroid ? (screenHeight > 700 ? 14 : 12) : 12;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60 + insets.bottom, // altura + safe area
          borderTopWidth: 0.3,
          borderTopColor: "#ddd",
          paddingBottom: insets.bottom, // importante
        },
        tabBarLabelStyle: {
          fontSize: labelFontSize,
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person-circle-outline"
              size={iconSize}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pictograms"
        options={{
          title: "Pictogramas",
          tabBarIcon: ({ color }) => (
            <Ionicons name="images-outline" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="grids"
        options={{
          title: "Tableros",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={iconSize} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="speaker-stats"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="stats-chart-outline"
              size={iconSize}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="speaker-selection"
        options={{
          title: "Speakers",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="stats-chart-outline"
              size={iconSize}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
