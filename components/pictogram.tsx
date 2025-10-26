import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type Pictogram = {
  id: number | string;
  name: string;
  bgColor?: string;
  imageUrl?: string | null;
};

type PictogramItemProps = {
  pictogram: Pictogram;
  size: number;
};

const PictogramItem: React.FC<PictogramItemProps> = ({ pictogram, size }) => {
  const imageSource =
    pictogram.imageUrl && pictogram.imageUrl.length > 0
      ? { uri: pictogram.imageUrl }
      : require("../assets/images/icon.png"); // fallback local

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: pictogram.bgColor || "#E5E7EB",
          width: size,
          height: size + 30,
        },
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={imageSource}
          style={[styles.image, { width: size * 0.6, height: size * 0.6 }]}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.text} numberOfLines={2}>
        {pictogram.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  image: {
    borderRadius: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    color: "#1E293B",
  },
});

export default PictogramItem;
