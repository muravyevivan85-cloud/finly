import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          Psychology<span>Platform</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Главная</NavLink>
          <NavLink to="/psychologists">Психологи</NavLink>
          <NavLink to="/articles">Статьи</NavLink>
          {user?.role === "admin" && <NavLink to="/users">Пользователи</NavLink>}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-email">{user.email}</span>
              <button className="button button-small button-outline" onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link className="button button-small button-outline" to="/login">Войти</Link>
              <Link className="button button-small" to="/register">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
