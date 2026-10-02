import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text
} from "react-native";

export default function Button({
  title,
  onPress,
  loading = false,
  variant = "primary"
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "primary" | "outline";
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.button,
        variant === "outline" && styles.outline,
        pressed && styles.pressed,
        loading && styles.disabled
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#17202a" : "#fff"} />
      ) : (
        <Text style={[styles.text, variant === "outline" && styles.outlineText]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#17202a",
    marginBottom: 12
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#cfd4dc"
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16
  },
  outlineText: {
    color: "#17202a"
  },
  pressed: {
    opacity: 0.8
  },
  disabled: {
    opacity: 0.55
  }
});
