import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Screen from "../src/components/Screen";
import Loading from "../src/components/Loading";
import { api } from "../src/services/api";

export default function HealthScreen() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.health>> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.health()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"));
  }, []);

  return (
    <Screen>
      <Text style={styles.title}>API Health</Text>

      {!data && !error ? <Loading /> : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {data ? (
        <View style={styles.card}>
          <Text>Server: {data.server}</Text>
          <Text>Database: {data.database}</Text>
          <Text>Database time: {data.databaseTime}</Text>
        </View>
      ) : null}
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
    padding: 20,
    borderRadius: 16,
    gap: 10
  },
  error: {
    color: "#b42318"
  }
});
