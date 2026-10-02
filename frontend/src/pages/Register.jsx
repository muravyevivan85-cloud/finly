import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

const initialForm = {
  email: "",
  password: "",
  first_name: "",
  last_name: "",
  phone: ""
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов.");
      return;
    }

    setLoading(true);

    try {
      await api.register(form);
      navigate("/login", {
        replace: true,
        state: { message: "Регистрация прошла успешно. Теперь войдите." }
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Регистрация</h1>
        <p>Создайте аккаунт клиента.</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Имя *
            <input name="first_name" value={form.first_name} onChange={handleChange} required />
          </label>
          <label>
            Фамилия
            <input name="last_name" value={form.last_name} onChange={handleChange} />
          </label>
          <label>
            Телефон
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Email *
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Пароль *
            <input name="password" type="password" value={form.password} onChange={handleChange} minLength={6} required />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button className="button full-width" disabled={loading}>
            {loading ? "Регистрация..." : "Создать аккаунт"}
          </button>
        </form>
        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </main>
  );
}
