import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLead(event) {
    event.preventDefault();
    setMessage("");

    if (!email.trim()) {
      setMessage("Введите email.");
      return;
    }

    setLoading(true);

    try {
      await api.createLead({ source: "website-home" });
      setMessage("Заявка принята. Мы свяжемся с вами.");
      setEmail("");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Психологическая помощь</span>
            <h1>Разобраться в сложной ситуации и сделать следующий шаг</h1>
            <p className="hero-text">
              Индивидуальные консультации, помощь родителям, подросткам и парам.
              Начните с описания своей ситуации.
            </p>
            <div className="hero-actions">
              <button className="button" onClick={() => navigate("/psychologists")}>
                Найти психолога
              </button>
              <button className="button button-outline" onClick={() => navigate("/articles")}>
                Читать статьи
              </button>
            </div>
          </div>

          <div className="lead-card">
            <h2>Хотите получить консультацию?</h2>
            <p>Оставьте контакт — это создаст заявку в системе.</p>
            <form onSubmit={handleLead}>
              <input
                type="email"
                placeholder="Ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="button full-width" disabled={loading}>
                {loading ? "Отправка..." : "Оставить заявку"}
              </button>
            </form>
            {message && <p className="form-message">{message}</p>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>С чем можно обратиться</h2>
          <div className="cards-grid">
            <article className="info-card">
              <h3>Подростки</h3>
              <p>Тревожность, отношения, самооценка, конфликты с родителями, школа.</p>
            </article>
            <article className="info-card">
              <h3>Родители</h3>
              <p>Поведение ребёнка, границы, воспитание, кризисные ситуации.</p>
            </article>
            <article className="info-card">
              <h3>Пары</h3>
              <p>Конфликты, доверие, ревность, разговоры о будущем и отношения.</p>
            </article>
            <article className="info-card">
              <h3>Семья</h3>
              <p>Сложные отношения между поколениями и поиск новых границ.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
