import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await api.login(form);
      login(data);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Вход</h1>
        <p>Войдите в свой аккаунт.</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Пароль
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button className="button full-width" disabled={loading}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
        <p className="auth-footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </main>
  );
}
