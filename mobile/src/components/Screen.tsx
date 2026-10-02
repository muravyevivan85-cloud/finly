import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ViewStyle
} from "react-native";

export default function Screen({
  children,
  contentContainerStyle
}: {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[styles.content, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f7f8fa"
  },
  content: {
    padding: 20,
    paddingBottom: 40
  }
});
