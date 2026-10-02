import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";
import Screen from "../src/components/Screen";
import Loading from "../src/components/Loading";
import { api, Article } from "../src/services/api";

export default function ArticlesScreen() {
  const [items, setItems] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getArticles()
      .then((data) => setItems(data.articles || []))
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Screen><Loading /></Screen>;

  return (
    <Screen>
      <Text style={styles.title}>Статьи</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!error && items.length === 0 ? (
        <Text style={styles.empty}>Пока нет опубликованных статей.</Text>
      ) : null}

      {items.map((item) => (
        <View style={styles.card} key={item.id}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.image} />
          ) : null}

          {item.category ? (
            <Text style={styles.category}>{item.category}</Text>
          ) : null}

          <Text style={styles.articleTitle}>{item.title}</Text>

          <Text style={styles.author}>
            {item.first_name} {item.last_name || ""}
          </Text>

          <Text style={styles.content}>
            {item.content?.length > 500
              ? `${item.content.slice(0, 500)}...`
              : item.content}
          </Text>
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
    marginBottom: 16,
    overflow: "hidden",
    paddingBottom: 20
  },
  image: {
    width: "100%",
    height: 190
  },
  category: {
    marginTop: 18,
    marginHorizontal: 20,
    color: "#667085",
    fontWeight: "700"
  },
  articleTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
    marginHorizontal: 20
  },
  author: {
    color: "#667085",
    marginTop: 6,
    marginHorizontal: 20
  },
  content: {
    color: "#475467",
    lineHeight: 22,
    marginTop: 14,
    marginHorizontal: 20
  },
  error: {
    color: "#b42318"
  },
  empty: {
    color: "#667085"
  }
});
