import { useEffect, useState } from "react";
import { api } from "../services/api";
import Loading from "../components/Loading";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getArticles()
      .then((data) => setArticles(data.articles || []))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Полезные материалы</span>
        <h1>Статьи</h1>
        {loading && <Loading />}
        {error && <div className="error-message">{error}</div>}
        <div className="articles-grid">
          {articles.map((article) => (
            <article className="article-card" key={article.id}>
              {article.image_url && <img src={article.image_url} alt="" className="article-image" />}
              <div className="article-content">
                {article.category && <span className="tag">{article.category}</span>}
                <h2>{article.title}</h2>
                <p className="muted">{article.first_name} {article.last_name || ""}</p>
                <p className="article-text">
                  {article.content?.length > 240 ? `${article.content.slice(0, 240)}...` : article.content}
                </p>
              </div>
            </article>
          ))}
        </div>
        {!loading && !error && articles.length === 0 && (
          <div className="empty-state">Пока нет опубликованных статей.</div>
        )}
      </div>
    </main>
  );
}
