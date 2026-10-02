import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Button from "../src/components/Button";
import Screen from "../src/components/Screen";
import { useAuth } from "../src/context/AuthContext";

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  if (!isAuthenticated || !user) {
    return (
      <Screen>
        <Text style={styles.title}>Профиль</Text>
        <Text style={styles.text}>Вы не авторизованы.</Text>
        <Button title="Войти" onPress={() => router.push("/login")} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Профиль</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Роль</Text>
        <Text style={styles.value}>{user.role || "client"}</Text>

        {user.id ? (
          <>
            <Text style={styles.label}>ID</Text>
            <Text style={styles.small}>{user.id}</Text>
          </>
        ) : null}
      </View>

      <Button
        title="Выйти"
        variant="outline"
        onPress={() =>
          Alert.alert("Выход", "Выйти из аккаунта?", [
            { text: "Отмена", style: "cancel" },
            { text: "Выйти", onPress: handleLogout }
          ])
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20
  },
  label: {
    color: "#667085",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10
  },
  value: {
    fontSize: 17,
    marginTop: 4
  },
  small: {
    fontSize: 12,
    color: "#475467",
    marginTop: 4
  },
  text: {
    color: "#667085",
    marginBottom: 20
  }
});
