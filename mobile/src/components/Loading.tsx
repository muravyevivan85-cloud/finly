import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function Loading({ text = "Загрузка..." }: { text?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#17202a" />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    marginTop: 12,
    color: "#667085"
  }
});
