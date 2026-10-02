import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import Button from "../src/components/Button";
import Input from "../src/components/Input";
import Screen from "../src/components/Screen";
import { api } from "../src/services/api";
import { useAuth } from "../src/context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || !password) {
      Alert.alert("Ошибка", "Введите email и пароль.");
      return;
    }

    setLoading(true);

    try {
      const data = await api.login({ email, password });
      await login(data);
      router.replace("/");
    } catch (error) {
      Alert.alert(
        "Ошибка входа",
        error instanceof Error ? error.message : "Не удалось войти."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>Вход</Text>
      <Text style={styles.subtitle}>Войдите в свой аккаунт.</Text>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="your@email.com"
        keyboardType="email-address"
      />

      <Input
        label="Пароль"
        value={password}
        onChangeText={setPassword}
        placeholder="Пароль"
        secureTextEntry
      />

      <Button title="Войти" onPress={submit} loading={loading} />

      <Button
        title="Создать аккаунт"
        variant="outline"
        onPress={() => router.push("/register")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#17202a",
    marginTop: 25
  },
  subtitle: {
    color: "#667085",
    fontSize: 16,
    marginBottom: 25
  }
});
