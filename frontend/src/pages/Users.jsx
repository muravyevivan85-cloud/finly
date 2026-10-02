import { useEffect, useState } from "react";
import { api } from "../services/api";
import Loading from "../components/Loading";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getUsers()
      .then((data) => setUsers(data.users || []))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="section">
      <div className="container">
        <span className="eyebrow">Администрирование</span>
        <h1>Пользователи</h1>
        {loading && <Loading />}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Активен</th>
                  <th>Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.is_active ? "Да" : "Нет"}</td>
                    <td>{new Date(user.created_at).toLocaleString("ru-RU")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
