import { useEffect, useState } from "react";
import { api } from "../services/api";
import Loading from "../components/Loading";

export default function Psychologists() {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getPsychologists()
      .then((data) => setPsychologists(data.psychologists || []))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Специалисты</span>
        <h1>Психологи</h1>
        {loading && <Loading />}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && psychologists.length === 0 && (
          <div className="empty-state">Пока нет доступных психологов.</div>
        )}
        <div className="cards-grid">
          {psychologists.map((psychologist) => (
            <article className="psychologist-card" key={psychologist.id}>
              {psychologist.avatar_url ? (
                <img src={psychologist.avatar_url} alt="" className="avatar" />
              ) : (
                <div className="avatar avatar-placeholder">
                  {psychologist.first_name?.[0] || "П"}
                </div>
              )}
              <h2>{psychologist.first_name} {psychologist.last_name || ""}</h2>
              <p className="muted">{psychologist.specialization}</p>
              {psychologist.experience_years != null && <p>Опыт: {psychologist.experience_years} лет</p>}
              {psychologist.rating != null && <p>Рейтинг: {psychologist.rating}</p>}
              {psychologist.education && <p><strong>Образование:</strong> {psychologist.education}</p>}
              {psychologist.about && <p>{psychologist.about}</p>}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
