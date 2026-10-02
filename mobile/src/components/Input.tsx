import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View
} from "react-native";

export default function Input({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor="#98a2b3"
        autoCapitalize={props.autoCapitalize ?? "none"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14
  },
  label: {
    fontWeight: "700",
    marginBottom: 7,
    color: "#344054"
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d0d5dd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: "#17202a"
  }
});
