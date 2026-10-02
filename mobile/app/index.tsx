import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View
} from "react-native";
import Button from "../src/components/Button";
import Input from "../src/components/Input";
import Screen from "../src/components/Screen";
import { api } from "../src/services/api";
import { useAuth } from "../src/context/AuthContext";

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function createLead() {
    if (!email.trim()) {
      Alert.alert("Ошибка", "Введите email.");
      return;
    }

    setLoading(true);

    try {
      await api.createLead({
        user_id: user?.id ?? null,
        source: "mobile-home"
      });

      Alert.alert(
        "Заявка принята",
        "Заявка создана в системе."
      );
      setEmail("");
    } catch (error) {
      Alert.alert(
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось создать заявку."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>ПСИХОЛОГИЧЕСКАЯ ПОМОЩЬ</Text>
        <Text style={styles.title}>
          Разобраться в сложной ситуации и сделать следующий шаг
        </Text>
        <Text style={styles.text}>
          Индивидуальные консультации, помощь родителям,
          подросткам и парам.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Начать</Text>

        <Button
          title="Найти психолога"
          onPress={() => router.push("/psychologists")}
        />

        <Button
          title="Читать статьи"
          variant="outline"
          onPress={() => router.push("/articles")}
        />

        {!isAuthenticated && (
          <Button
            title="Войти"
            variant="outline"
            onPress={() => router.push("/login")}
          />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Получить консультацию</Text>
        <Text style={styles.cardText}>
          Создайте заявку через мобильное приложение.
        </Text>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          keyboardType="email-address"
        />

        <Button
          title="Оставить заявку"
          onPress={createLead}
          loading={loading}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>С чем можно обратиться</Text>
        <Text style={styles.item}>• Подростки и отношения с родителями</Text>
        <Text style={styles.item}>• Тревожность и самооценка</Text>
        <Text style={styles.item}>• Конфликты в паре</Text>
        <Text style={styles.item}>• Воспитание и поведение ребёнка</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingVertical: 22
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#667085",
    marginBottom: 10
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    color: "#17202a",
    marginBottom: 14
  },
  text: {
    fontSize: 17,
    lineHeight: 25,
    color: "#667085"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    marginBottom: 16
  },
  cardTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#17202a",
    marginBottom: 10
  },
  cardText: {
    color: "#667085",
    marginBottom: 14
  },
  item: {
    fontSize: 16,
    color: "#344054",
    marginBottom: 9
  }
});
