import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import Button from "../src/components/Button";
import Input from "../src/components/Input";
import Screen from "../src/components/Screen";
import { api } from "../src/services/api";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  function update(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit() {
    if (!form.first_name || !form.email || !form.password) {
      Alert.alert("Ошибка", "Заполните обязательные поля.");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Ошибка", "Пароль должен содержать минимум 6 символов.");
      return;
    }

    setLoading(true);

    try {
      await api.register(form);
      Alert.alert(
        "Готово",
        "Регистрация прошла успешно.",
        [{ text: "Войти", onPress: () => router.replace("/login") }]
      );
    } catch (error) {
      Alert.alert(
        "Ошибка регистрации",
        error instanceof Error ? error.message : "Не удалось зарегистрироваться."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>Регистрация</Text>
      <Text style={styles.subtitle}>Создайте аккаунт клиента.</Text>

      <Input
        label="Имя *"
        value={form.first_name}
        onChangeText={(value) => update("first_name", value)}
        placeholder="Имя"
        autoCapitalize="words"
      />

      <Input
        label="Фамилия"
        value={form.last_name}
        onChangeText={(value) => update("last_name", value)}
        placeholder="Фамилия"
        autoCapitalize="words"
      />

      <Input
        label="Телефон"
        value={form.phone}
        onChangeText={(value) => update("phone", value)}
        placeholder="+7..."
        keyboardType="phone-pad"
      />

      <Input
        label="Email *"
        value={form.email}
        onChangeText={(value) => update("email", value)}
        placeholder="your@email.com"
        keyboardType="email-address"
      />

      <Input
        label="Пароль *"
        value={form.password}
        onChangeText={(value) => update("password", value)}
        placeholder="Минимум 6 символов"
        secureTextEntry
      />

      <Button
        title="Создать аккаунт"
        onPress={submit}
        loading={loading}
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
