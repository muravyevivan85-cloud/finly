import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import Screen from "../src/components/Screen";
import Loading from "../src/components/Loading";
import { api, Psychologist } from "../src/services/api";

export default function PsychologistsScreen() {
  const [items, setItems] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getPsychologists()
      .then((data) => setItems(data.psychologists || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Screen><Loading /></Screen>;

  return (
    <Screen>
      <Text style={styles.title}>Психологи</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!error && items.length === 0 ? (
        <Text style={styles.empty}>Пока нет доступных психологов.</Text>
      ) : null}

      {items.map((item) => (
        <View style={styles.card} key={item.id}>
          {item.avatar_url ? (
            <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                {item.first_name?.[0] || "П"}
              </Text>
            </View>
          )}

          <Text style={styles.name}>
            {item.first_name} {item.last_name || ""}
          </Text>

          {item.specialization ? (
            <Text style={styles.specialization}>{item.specialization}</Text>
          ) : null}

          {item.experience_years != null ? (
            <Text>Опыт: {item.experience_years} лет</Text>
          ) : null}

          {item.rating != null ? (
            <Text>Рейтинг: {item.rating}</Text>
          ) : null}

          {item.education ? (
            <Text style={styles.info}>Образование: {item.education}</Text>
          ) : null}

          {item.about ? (
            <Text style={styles.info}>{item.about}</Text>
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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 20,
    marginBottom: 16
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    marginBottom: 12
  },
  placeholder: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#eef1f4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  placeholderText: {
    fontSize: 30,
    fontWeight: "800"
  },
  name: {
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 5
  },
  specialization: {
    color: "#667085",
    marginBottom: 10
  },
  info: {
    color: "#475467",
    marginTop: 8,
    lineHeight: 21
  },
  error: {
    color: "#b42318",
    marginBottom: 20
  },
  empty: {
    color: "#667085"
  }
});
