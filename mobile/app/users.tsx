import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Screen from "../src/components/Screen";
import Loading from "../src/components/Loading";
import { useAuth } from "../src/context/AuthContext";
import { api, User } from "../src/services/api";

export default function UsersScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "admin") {
      setLoading(false);
      setError("Доступ только для администратора.");
      return;
    }

    api.getUsers()
      .then((data) => setItems(data.users || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setLoading(false));
  }, [user?.role]);

  if (loading) return <Screen><Loading /></Screen>;

  return (
    <Screen>
      <Text style={styles.title}>Пользователи</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {items.map((item) => (
        <View style={styles.card} key={item.id}>
          <Text style={styles.email}>{item.email}</Text>
          <Text>Роль: {item.role}</Text>
          <Text>Активен: {item.is_active ? "Да" : "Нет"}</Text>
          {item.created_at ? (
            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleString("ru-RU")}
            </Text>
          ) : null}
        </View>
      ))}
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 18,
    marginBottom: 12
  },
  email: {
    fontWeight: "800",
    fontSize: 17,
    marginBottom: 7
  },
  date: {
    color: "#667085",
    marginTop: 5
  },
  error: {
    color: "#b42318",
    marginBottom: 15
  }
});
